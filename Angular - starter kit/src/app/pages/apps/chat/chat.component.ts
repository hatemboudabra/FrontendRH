import { Component, OnInit } from '@angular/core';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { CommonModule, DatePipe } from '@angular/common';
import { SimplebarAngularModule } from 'simplebar-angular';
import { NavModule } from '../../../Component/tab/tab.module';
import { LUCIDE_ICONS, LucideAngularModule, LucideIconProvider, icons } from 'lucide-angular';
import { DrawerModule } from '../../../Component/drawer';
import { MDModalModule } from '../../../Component/modals';
import { MnDropdownComponent } from '../../../Component/dropdown';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChatMessageDTO } from '../../../data/chat';
import { ChatService } from '../../../core/services/chat.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { User } from '../../../store/Authentication/auth.models';
import { BehaviorSubject } from 'rxjs';
import { TeamService } from '../../../core/services/team.service';

interface Collaborator {
  id: number;
  username: string;
  post: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    PageTitleComponent,
    CommonModule,
    SimplebarAngularModule,
    NavModule,
    LucideAngularModule,
    DrawerModule,
    MDModalModule,
    MnDropdownComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DatePipe
  ],
  templateUrl: './chat.component.html',
  styles: ``,
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }],
})
export class ChatComponent implements OnInit {
  allMessages: ChatMessageDTO[] = [];
  displayedMessages: ChatMessageDTO[] = [];
  formData!: UntypedFormGroup;
  collaborators: Collaborator[] = [];
  filteredCollaborators: Collaborator[] = [];
  selectedCollaboratorId: number | null = null;
  currentUser: User | null = null;
  currentUserId: string | null = null;
  chatMode: 'private' | 'team' = 'private';
  messages$ = new BehaviorSubject<ChatMessageDTO[]>([]);
  searchQuery: string = '';
  teamId: string = '1';
  currentUserTeamId: number | null = null;
  currentUserTeamName: string | null = null;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private chatService: ChatService,
    private authService: AuthenticationService,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCurrentUser();
    this.loadCollaborators();
    this.setupMessageSubscription();
    
    if (this.selectedCollaboratorId) {
    //  this.loadMessages();
    }
  }/*
  loadMessages(): void {
    if (this.chatMode === 'private' && this.selectedCollaboratorId) {
      this.chatService.getPrivateMessages(this.selectedCollaboratorId.toString()).subscribe({
        next: (messages) => {
          this.allMessages = messages;
          this.filterMessages();
        },
        error: (error) => console.error('Error loading private messages:', error)
      });
    } else if (this.chatMode === 'team') {
      this.chatService.getTeamMessages(this.teamId).subscribe({
        next: (messages) => {
          this.allMessages = messages;
          this.filterMessages();
        },
        error: (error) => console.error('Error loading team messages:', error)
      });
    }
  }
*/
  private initializeForm(): void {
    this.formData = this.formBuilder.group({
      chatMsg: [{ value: '', disabled: this.shouldDisableInput() }, [Validators.required]]
    });
  }

  private shouldDisableInput(): boolean {
    return this.chatMode === 'private' && !this.selectedCollaboratorId;
  }

  private updateInputState(): void {
    const control = this.formData.get('chatMsg');
    if (this.shouldDisableInput()) {
      control?.disable({ emitEvent: false });
    } else {
      control?.enable({ emitEvent: false });
    }
  }

  loadCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user?.username) {
          this.currentUser = user;
          this.getUserIdByUsername(user.username);
        }
      },
      error: (error) => console.error('Error loading user:', error)
    });
  }

  getUserIdByUsername(username: string): void {
    this.authService.getUserByUsername(username).subscribe({
      next: (userDetails) => {
        if (userDetails?.id) {
          this.currentUserId = userDetails.id.toString();
          this.currentUser!.id = userDetails.id;
          this.filterCollaborators();
        }
      },
      error: (error) => console.error('Error getting user ID:', error)
    });
  }

  loadCollaborators(): void {
    this.authService.ListUser().subscribe({
      next: (users) => {
        this.collaborators = users
          .filter(user => user.id && typeof user.username === 'string')
          .map(user => ({
            id: user.id,
            username: user.username,
            post: user.post || 'Non spécifié'
          }));
        
        this.filterCollaborators();
      },
      error: (error) => console.error('Error loading collaborators:', error)
    });
  }

  toggleChatMode(mode: 'private' | 'team'): void {
    this.chatMode = mode;
    this.updateInputState();
    this.filterMessages();
  }

  filterCollaborators(): void {
    this.filteredCollaborators = this.collaborators.filter(
      collaborator => collaborator.id !== this.currentUser?.id
    );
  }

  filterMessages(): void {
    // Vérification optimisée de l'utilisateur courant
    if (!this.currentUser) {
        console.debug('Utilisateur non chargé - filtrage différé');
        this.displayedMessages = [];
        return;
    }

    // Si mode privé mais aucun collaborateur sélectionné
    if (this.chatMode === 'private' && !this.selectedCollaboratorId) {
        this.displayedMessages = [];
        return;
    }

    const currentUserIdStr = this.currentUser.id.toString();
    const selectedIdStr = this.selectedCollaboratorId?.toString() ?? '';

    this.displayedMessages = this.allMessages.filter(message => {
        // Validation basique du message
        if (!message?.sender || !message?.chatRoomId || !message?.type || !message?.timestamp) {
            return false;
        }

        // Filtrage selon le mode
        if (this.chatMode === 'private') {
            return message.type === 'PRIVATE' && 
                  ((message.sender === currentUserIdStr && message.chatRoomId === selectedIdStr) ||
                   (message.sender === selectedIdStr && message.chatRoomId === currentUserIdStr));
        } 
        
        // Mode team
        return message.type === 'TEAM' && message.chatRoomId === this.teamId;
    });

    // Tri chronologique sécurisé
    try {
        this.displayedMessages.sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
    } catch (e) {
        console.error('Erreur lors du tri des messages', e);
    }
}
setupMessageSubscription(): void {
  this.chatService.getMessages().subscribe({
      next: (message) => {
          if (!message || typeof message !== 'object') {
              console.error('Message rejeté - format invalide');
              return;
          }

          console.log('Nouveau message reçu:', message);
          this.allMessages.push(message);
          this.filterMessages();
      },
      error: (err) => console.error('Erreur WebSocket:', err)
  });
}
sendMessage(): void {
  if (this.formData.invalid || !this.currentUserId) return;

  const content = this.formData.get('chatMsg')?.value?.trim();
  if (!content) return;

  const message: ChatMessageDTO = {
      sender: this.currentUserId,
      content: content,
      timestamp: new Date().toISOString(),
      type: this.chatMode === 'private' ? 'PRIVATE' : 'TEAM',
      senderUsername: this.currentUser?.username || 'Utilisateur',
      senderTeamName: 'hala',
      chatRoomId: this.chatMode === 'private' 
          ? this.selectedCollaboratorId?.toString() || ''
          : this.teamId
  };

  if (this.chatMode === 'private' && this.selectedCollaboratorId) {
      this.chatService.sendPrivateMessage(
          this.selectedCollaboratorId.toString(), 
          message
      );
  } else {
      this.chatService.sendTeamMessage(this.teamId, message);
  }

  this.formData.reset();
}

  selectCollaborator(collaboratorId: number): void {
    this.selectedCollaboratorId = collaboratorId;
    console.log("Selected collaborator ID set to:", this.selectedCollaboratorId);
    this.updateInputState();
    this.filterMessages();
}

  isCurrentUserMessage(message: ChatMessageDTO): boolean {
    return message.sender === this.currentUserId;
  }

  getMessageSenderInitial(message: ChatMessageDTO): string {
    return message.senderUsername?.charAt(0).toUpperCase() || 'U';
  }

  getMessageSenderName(message: ChatMessageDTO): string {
    return message.senderUsername || 'Utilisateur';
  }

  getSelectedCollaboratorInitial(): string {
    if (this.chatMode === 'team') return 'T';
    
    const collaborator = this.collaborators.find(c => c.id === this.selectedCollaboratorId);
    return collaborator?.username?.charAt(0).toUpperCase() || 'C';
  }

  getSelectedCollaboratorName(): string {
    if (this.chatMode === 'team') return 'Équipe';
    
    const collaborator = this.collaborators.find(c => c.id === this.selectedCollaboratorId);
    return collaborator?.username || 'Collaborateur';
  }

  getSelectedCollaboratorPost(): string {
    if (this.chatMode === 'team') return 'Équipe';
    
    const collaborator = this.collaborators.find(c => c.id === this.selectedCollaboratorId);
    return collaborator?.post || 'Poste non spécifié';
  }

  filterCollaboratorsBySearch(): void {
    if (this.searchQuery) {
      this.filteredCollaborators = this.collaborators.filter(
        collaborator => collaborator.username.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
                      collaborator.id !== this.currentUser?.id
      );
    } else {
      this.filterCollaborators();
    }
  }
}