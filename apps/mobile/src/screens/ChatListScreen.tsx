
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { Plus, Settings, Compass, Search } from 'lucide-react-native';

// Mock Data (replace with actual data later)
const chats = [
    { id: '1', name: 'QuantumLeap', lastMessage: 'See you there!', time: '9:41 PM', unread: 2, online: true },
    { id: '2', name: 'EchoSphere', lastMessage: 'Okay, sounds good.', time: '8:15 PM', unread: 0, online: false },
    { id: '3', name: 'Group Project', lastMessage: 'Alice: I pushed the final designs.', time: 'Yesterday', unread: 5, online: true, isGroup: true },
    { id: '4', name: 'RogueAgent', lastMessage: 'Message deleted', time: 'Yesterday', unread: 0, online: false }
];

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledTextInput = styled(TextInput);


const ChatListItem = ({ chat, onPress }) => (
    <StyledTouchableOpacity onPress={onPress} className="flex-row items-center gap-4 p-2 rounded-lg active:bg-white/10">
        <StyledView className={`h-14 w-14 rounded-full items-center justify-center bg-white/10 ${chat.isGroup ? 'bg-purple-500/30' : ''}`}>
            <StyledText className="text-xl font-bold text-white">{chat.name.charAt(0)}</StyledText>
            {chat.online && !chat.isGroup && <StyledView className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-black" />}
        </StyledView>
        <StyledView className="flex-1">
            <StyledView className="flex-row justify-between items-center">
                <StyledText className="font-semibold text-base text-white">{chat.name}</StyledText>
                <StyledText className="text-xs text-gray-400 font-sans">{chat.time}</StyledText>
            </StyledView>
            <StyledView className="flex-row justify-between items-center mt-1">
                <StyledText className="text-sm text-gray-400 font-sans flex-1" numberOfLines={1}>{chat.lastMessage}</StyledText>
                {chat.unread > 0 && (
                    <StyledView className="h-5 w-5 items-center justify-center rounded-full bg-accent">
                        <StyledText className="text-white text-xs font-bold">{chat.unread}</StyledText>
                    </StyledView>
                )}
            </StyledView>
        </StyledView>
    </StyledTouchableOpacity>
);

export default function ChatListScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView className="flex-1 bg-black text-white">
            <StyledView className="flex-row items-center justify-between p-4 h-16">
                 <StyledText className="text-3xl font-headline font-bold text-white">WinkyX</StyledText>
                 <StyledView className="flex-row items-center gap-2">
                    <StyledTouchableOpacity className="p-1 active:scale-95"><Compass color="white" size={28} /></StyledTouchableOpacity>
                    <StyledTouchableOpacity className="p-1 active:scale-95"><Plus color="white" size={28}/></StyledTouchableOpacity>
                    <StyledTouchableOpacity onPress={() => navigation.navigate('Profile')} className="p-1 active:scale-95"><Settings color="white" size={28}/></StyledTouchableOpacity>
                 </StyledView>
            </StyledView>

            <StyledView className="px-4 pb-4">
                 <StyledView className="relative">
                    <StyledView className="absolute left-3 top-1/2 -translate-y-3.5 z-10">
                        <Search color="hsl(var(--muted-foreground))" size={20} />
                    </StyledView>
                     <StyledTextInput
                        placeholder="Search..."
                        placeholderTextColor="hsl(var(--muted-foreground))"
                        className="w-full h-10 bg-muted rounded-full pl-10 pr-4 text-foreground"
                    />
                </StyledView>
            </StyledView>

            <StyledScrollView className="flex-1 px-2">
                {chats.map(chat => (
                    <ChatListItem key={chat.id} chat={chat} onPress={() => navigation.navigate('Chat', { chatId: chat.id, chatName: chat.name })} />
                ))}
            </StyledScrollView>
        </SafeAreaView>
    );
}
