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
import { MessagChatService } from '../../../core/services/message.service';

interface Collaborator {
  id: number;
  username: string;
  post: string;
}

interface TeamInfo {
  role: string;
  teamId?: number;
  teamName?: string;
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
  teamId: string = '0'; 
  currentUserTeamId: number | null = null;
  currentUserTeamName: string | null = null;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private chatService: ChatService,
    private authService: AuthenticationService,
    private teamService: TeamService,
    private messageService: MessagChatService

  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCurrentUser(); 
    this.loadCollaborators();
    this.setupMessageSubscription();
//  this.loadChatHistory()
  }

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
          if (user.id) {
            this.loadTeamInfo(user.id); 
          }
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
          if (this.currentUser) {
            this.currentUser.id = userDetails.id;
          }
          this.filterCollaborators();
        }
      },
      error: (error) => console.error('Error getting user ID:', error)
    });
  }
  loadTeamInfo(userId: number): void {
    this.teamService.getTeamInfoByUserId(userId).subscribe({
      next: (teamInfo) => {
        this.currentUserTeamId = teamInfo.teamId ?? null;
        this.currentUserTeamName = teamInfo.teamName ?? null;
        this.teamId = teamInfo.teamId?.toString() ?? '0';
        
        console.log('Team info loaded:', {
          teamId: this.teamId,
          teamName: this.currentUserTeamName
        });
        if (this.chatMode === 'team') {
          this.loadChatHistory();
        }
      },
      error: (error) => {
        console.error('Error loading team info:', error);
        this.teamId = '0'; 
      }
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
    if (mode === 'team' && this.currentUser?.id) {
      this.loadTeamInfo(this.currentUser.id);
    } else {
      this.filterMessages();
    }
  }

  filterCollaborators(): void {
    this.filteredCollaborators = this.collaborators.filter(
      collaborator => collaborator.id !== this.currentUser?.id
    );
  }

  private filterMessages(): void {
    if (!this.currentUserId) {
      this.displayedMessages = [];
      return;
    }
    const uniqueMessages = new Map<string, ChatMessageDTO>();
    this.allMessages.forEach(message => {
      if (!message) return;
  
      const messageKey = `${message.content}-${message.sender}-${message.timestamp}`;
      
      if (this.chatMode === 'private') {
        if (message.type === 'PRIVATE' && 
            ((message.sender === this.currentUserId && message.recipientId === this.selectedCollaboratorId?.toString()) ||
             (message.sender === this.selectedCollaboratorId?.toString() && message.recipientId === this.currentUserId))) {
          uniqueMessages.set(messageKey, message);
        }
      } else {
        if (message.type === 'TEAM' && message.chatRoomId === this.teamId) {
          uniqueMessages.set(messageKey, message);
        }
      }
    });
    this.displayedMessages = Array.from(uniqueMessages.values()).sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }
  private setupMessageSubscription(): void {
    this.chatService.getMessages().subscribe({
      next: (message) => {
        if (!message || typeof message !== 'object') {
          console.error('Message rejeté - format invalide');
          return;
        }
        if (!message.senderUsername && message.sender === this.currentUserId) {
          message.senderUsername = this.currentUser?.username || 'Vous';
        }
        console.log('Nouveau message reçu:', message);
        const isRelevant = this.isMessageRelevant(message);
        if (isRelevant) {
          this.allMessages.push(message);
          this.filterMessages();
          this.messages$.next([...this.allMessages]);
        }
      },
      error: (err) => console.error('Erreur WebSocket:', err)
    });
  }
  
  private isMessageRelevant(message: ChatMessageDTO): boolean {
    if (this.chatMode === 'private') {
      return message.type === 'PRIVATE' && 
            ((message.sender === this.currentUserId && message.recipientId === this.selectedCollaboratorId?.toString()) ||
             (message.sender === this.selectedCollaboratorId?.toString() && message.recipientId === this.currentUserId));
    } else {
      return message.type === 'TEAM' && message.chatRoomId === this.teamId;
    }
  }

  getSelectedCollaboratorPost(): string {
    if (this.chatMode === 'team') {
      return this.currentUserTeamName ? `Équipe ${this.currentUserTeamName}` : 'Équipe';
    }
    
    const collaborator = this.collaborators.find(c => c.id === this.selectedCollaboratorId);
    return collaborator?.post || 'Poste non spécifié';
  }

  sendMessage(): void {
    if (this.formData.invalid || !this.currentUserId) {
      console.warn('Formulaire invalide ou utilisateur non connecté');
      return;
    }
  
    const content = this.formData.get('chatMsg')?.value?.trim();
    if (!content) {
      console.warn('Le message ne peut pas être vide');
      return;
    }
  
    const message: ChatMessageDTO = {
      sender: this.currentUserId!,
      content: content,
      timestamp: new Date().toISOString(),
      type: this.chatMode === 'private' ? 'PRIVATE' : 'TEAM',
      senderUsername: this.currentUser?.username,
      senderTeamName: this.currentUserTeamName || 'Équipe inconnue',
      chatRoomId: this.chatMode === 'team' ? this.teamId : this.selectedCollaboratorId?.toString() || '',
      recipientId: this.chatMode === 'private' 
          ? this.selectedCollaboratorId?.toString() || null
          : null
    };
    this.allMessages.push(message);
    this.filterMessages();
    this.formData.reset();
    try {
      if (this.chatMode === 'private') {
        if (!this.selectedCollaboratorId) {
          console.error('Aucun collaborateur sélectionné');
          return;
        }
        this.chatService.sendPrivateMessage(
          this.selectedCollaboratorId.toString(), 
          message
        );
      } else {
        if (this.teamId === '0') {
          console.error('Aucune équipe assignée');
          return;
        }
        this.chatService.sendTeamMessage(this.teamId, message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
    }
  }
 selectCollaborator(collaboratorId: number): void {
  this.selectedCollaboratorId = collaboratorId;
  console.log("Selected collaborator ID set to:", this.selectedCollaboratorId);
  this.updateInputState();
  if (this.chatMode === 'private' && this.currentUser?.id) {
    this.loadChatHistory();
  } else {
    this.filterMessages();
  }
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
    if (this.chatMode === 'team') {
      return this.currentUserTeamName || 'Équipe';
    }
    
    const collaborator = this.collaborators.find(c => c.id === this.selectedCollaboratorId);
    return collaborator?.username || 'Collaborateur';
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
  
  private loadChatHistory(): void {
    if (this.chatMode === 'team' && this.teamId && this.teamId !== '0') {
      this.messageService.getTeamMessages(Number(this.teamId)).subscribe({
        next: (messages) => {
          this.allMessages = (messages || []).map(msg => ({
            ...msg,
            senderUsername: msg.senderUsername || this.getUsernameFromId(msg.sender)
          }));
          this.filterMessages();
        },
        error: (err) => console.error("Erreur historique équipe", err)
      });
    } else if (this.chatMode === 'private' && this.currentUser?.id && this.selectedCollaboratorId) {
      this.messageService.getPrivateMessages(
        this.currentUser.id, 
        this.selectedCollaboratorId
      ).subscribe({
        next: (messages) => {
          this.allMessages = (messages || []).map(msg => ({
            ...msg,
            senderUsername: msg.senderUsername || this.getUsernameFromId(msg.sender)
          }));
          this.filterMessages();
        },
        error: (err) => console.error("Erreur historique privé", err)
      });
    } else {
      this.allMessages = [];
      this.filterMessages();
    }
  }
  
  private getUsernameFromId(userId: string): string {
    if (userId === this.currentUserId) {
      return this.currentUser?.username || 'Vous';
    }
    const collaborator = this.collaborators.find(c => c.id.toString() === userId);
    return collaborator?.username || 'Utilisateur';
  }
  
}