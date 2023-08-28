import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, distinctUntilChanged, first } from 'rxjs';
import { OrderService } from '@ims/data-access';

export interface Chat {
  text: string;
  isUser: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  readonly http = inject(HttpClient);
  readonly orderService = inject(OrderService);

  private chatSubject = new BehaviorSubject<Chat[]>([
    { text: 'Hello! How can I assist you?', isUser: false },
  ]);
  public currentChat = this.chatSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  sendMessageAndReceiveResponse(userInput: string, code: string) {
    const newMessage: Chat = { text: userInput, isUser: true };
    const updatedMessages = [...this.chatSubject.value, newMessage];
    this.chatSubject.next(updatedMessages);

    // Display a loading message
    const loadingMessage: Chat = { text: '.........', isUser: false };
    const updatedMessagesWithLoading = [...updatedMessages, loadingMessage];
    this.chatSubject.next(updatedMessagesWithLoading);

    this.orderService
      .chatGpt(code)
      .pipe(first())
      .subscribe({
        next: (response) => {
          const botResponse: Chat = { text: response.response, isUser: false };
          const updatedMessagesWithBotResponse = [
            ...updatedMessages,
            botResponse,
          ];
          this.chatSubject.next(updatedMessagesWithBotResponse);
        },
        error: () => {
          const errorMessage: Chat = {
            text: 'An error occurred.',
            isUser: false,
          };
          const updatedMessagesWithError = [...updatedMessages, errorMessage];
          this.chatSubject.next(updatedMessagesWithError);
        },
      });
  }
}
