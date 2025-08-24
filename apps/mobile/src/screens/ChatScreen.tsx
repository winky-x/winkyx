
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { ArrowLeft, MoreVertical, Plus, ArrowUp, Check, CheckCheck } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import * as crypto from '../services/crypto';
import * as data from '../services/data';
import { getIdentity } from '../services/identity';
import type { Message as MessageType } from '@/lib/types';
import { getChat, updateChat } from '@/lib/data';


const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledTextInput = styled(TextInput);


const MessageBubble = ({ message }: { message: MessageType }) => {
    const isSent = message.isSentByCurrentUser;

    const StatusIcon = () => {
        if (!isSent) return null;
        if (message.status === 'read') return <CheckCheck color="#34b7f1" size={16} />;
        if (message.status === 'delivered') return <CheckCheck color="hsl(var(--muted-foreground))" size={16} />;
        return <Check color="hsl(var(--muted-foreground))" size={16} />;
    };

    return (
        <StyledView className={`flex w-full items-start gap-3 ${isSent ? 'justify-end' : 'justify-start'}`}>
            <StyledView className={`max-w-xs rounded-lg p-2.5 lg:max-w-md ${isSent ? 'bg-accent' : 'bg-secondary'}`}>
                <StyledText className={`text-sm ${isSent ? 'text-accent-foreground' : 'text-secondary-foreground'}`}>{message.text}</StyledText>
                <StyledView className="flex-row items-center justify-end gap-1.5 mt-1 h-4">
                    <StyledText className="text-xs text-muted-foreground">{new Date(message.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</StyledText>
                    {isSent && <StatusIcon />}
                </StyledView>
            </StyledView>
        </StyledView>
    );
};

export default function ChatScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { chatId, chatName } = route.params;

    const [messages, setMessages] = useState<MessageType[]>([]);
    const [inputText, setInputText] = useState('');
    const scrollViewRef = useRef<ScrollView>();

    const chat = getChat(chatId);

    // Load messages from DB on screen load
    useEffect(() => {
        if (chat) {
          data.getMessagesForPeer(chat.peer.publicKey).then(async (storedMessages) => {
              const decryptedMessages: MessageType[] = [];
              const identity = await getIdentity();

              for (const msg of storedMessages) {
                  const encryptedPayload = JSON.parse(msg.encrypted_content);
                  const senderPublicKey = crypto.fromBase64(msg.from_public_key);
                  const senderSignPublicKey = crypto.fromBase64('...'); // This needs to be stored with the peer
                  
                  const text = `Encrypted: ${encryptedPayload.ciphertext.substring(0, 20)}...`;
                  decryptedMessages.push({
                      id: msg.id,
                      text: text, // Placeholder for decrypted text
                      timestamp: msg.timestamp,
                      isSentByCurrentUser: msg.is_sent_by_current_user,
                      senderId: msg.from_public_key,
                      status: msg.status
                  });
              }
              
              setMessages(decryptedMessages);
          });
        } else {
             setMessages([]);
        }
    }, [chatId]);


    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const handleSendMessage = useCallback(async () => {
        if (inputText.trim() && chat) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

            const identity = await getIdentity();
            const peerPublicKeyBytes = crypto.fromBase64(chat.peer.publicKey);
            
            const encryptedPayload = await crypto.encryptMessage(inputText.trim(), peerPublicKeyBytes, identity.keyPair);

            const encryptedContent = JSON.stringify({
                ciphertext: crypto.toBase64(encryptedPayload.ciphertext),
                nonce: crypto.toBase64(encryptedPayload.nonce),
                signature: crypto.toBase64(encryptedPayload.signature),
            });

            const storedMessage: data.StoredMessage = {
                id: `msg-${Date.now()}`,
                peer_public_key: chat.peer.publicKey,
                from_public_key: identity.publicKeyBase64,
                to_public_key: chat.peer.publicKey,
                encrypted_content: encryptedContent,
                timestamp: Date.now(),
                status: 'queued',
                is_sent_by_current_user: true,
            }
            
            await data.saveMessage(storedMessage);
            await data.addMessageToQueue(storedMessage);
            
            const uiMessage: MessageType = {
              id: storedMessage.id,
              senderId: "currentUser",
              text: inputText.trim(),
              timestamp: storedMessage.timestamp,
              isSentByCurrentUser: true,
              status: "queued",
            };
            
            setMessages(prev => [...prev, uiMessage]);
            setInputText('');
        }
    }, [inputText, chat]);
    
    const handleShowMore = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert("More Options", "More options menu would appear here.");
    };
    
    const handleAddAttachment = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert("Add Attachment", "Attachment selection would open here.");
    };

    return (
        <SafeAreaView className="flex-1 bg-background text-foreground">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                {/* Header */}
                <StyledView className="flex-row shrink-0 items-center justify-between sticky top-0 z-10 border-b border-border p-2 h-14 bg-background">
                    <StyledView className="flex-row items-center gap-2">
                        <StyledTouchableOpacity onPress={() => navigation.goBack()} className="h-9 w-9 rounded-full items-center justify-center active:bg-muted/50 active:scale-95">
                            <ArrowLeft color="hsl(var(--foreground))" size={24} />
                        </StyledTouchableOpacity>
                         <StyledView className="h-8 w-8 rounded-full bg-secondary items-center justify-center">
                            <StyledText className="text-secondary-foreground font-bold">{chatName.charAt(0)}</StyledText>
                        </StyledView>
                    </StyledView>
                    <StyledView className="absolute left-1/2 top-1/2 -translate-x-12 -translate-y-3">
                        <StyledText className="font-medium text-sm text-foreground truncate">{chatName}</StyledText>
                    </StyledView>
                    <StyledTouchableOpacity onPress={handleShowMore} className="h-9 w-9 rounded-full items-center justify-center active:bg-muted/50 active:scale-95">
                        <MoreVertical color="hsl(var(--foreground))" size={24} />
                    </StyledTouchableOpacity>
                </StyledView>

                {/* Messages */}
                <StyledScrollView ref={scrollViewRef} className="flex-1" contentContainerStyle={{ padding: 16, gap: 16 }}>
                    {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
                </StyledScrollView>

                {/* Input */}
                <StyledView className="sticky bottom-0 bg-background z-20 pb-4 px-2 pt-2">
                    <StyledView className="flex-row rounded-xl bg-muted py-1 items-center">
                        <StyledTextInput
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Message"
                            placeholderTextColor="hsl(var(--muted-foreground))"
                            multiline
                            className="flex-1 border-none bg-transparent min-h-[2rem] py-2 px-4 text-foreground placeholder:text-muted-foreground"
                        />
                        <StyledTouchableOpacity onPress={handleAddAttachment} className="shrink-0 h-8 w-8 rounded-full items-center justify-center text-muted-foreground active:bg-white/10 active:scale-95 mr-2">
                            <Plus color="hsl(var(--foreground))" size={24}/>
                        </StyledTouchableOpacity>
                        <StyledTouchableOpacity onPress={handleSendMessage} className={`shrink-0 rounded-full h-8 w-8 p-1.5 active:scale-95 mr-2 ${inputText.trim() ? 'bg-primary' : 'bg-transparent'}`}>
                             <ArrowUp size={24} className={inputText.trim() ? 'text-primary-foreground' : 'text-muted-foreground'} />
                        </StyledTouchableOpacity>
                    </StyledView>
                </StyledView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
