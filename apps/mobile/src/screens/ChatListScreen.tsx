
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { Svg, Path } from 'react-native-svg';

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

// Icons
const PlusIcon = (props) => <Svg height="28" width="28" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M11.5 12.5V18a.5.5 0 0 0 1 0v-5.5H18a.5.5 0 0 0 0-1h-5.5V6a.5.5 0 0 0-1 0v5.5H6a.5.5 0 0 0 0 1h5.5Z"/></Svg>;
const SettingsIcon = (props) => <Svg height="28" width="28" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12 17.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm-4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm8 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/></Svg>;
const CompassIcon = (props) => <Svg height="28" width="28" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm4-8.5L9.5 14 7 8.5 14.5 7 16 11.5Z"/></Svg>;
const SearchIcon = (props) => <Svg height="20" width="20" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m16.325 14.899l5.38 5.38a1 1 0 0 1-1.415 1.413l-5.38-5.38a8 8 0 1 1 1.414-1.414ZM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"/></Svg>;


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
                    <StyledTouchableOpacity className="p-1 active:scale-95"><CompassIcon className="text-white"/></StyledTouchableOpacity>
                    <StyledTouchableOpacity className="p-1 active:scale-95"><PlusIcon className="text-white"/></StyledTouchableOpacity>
                    <StyledTouchableOpacity onPress={() => navigation.navigate('Profile')} className="p-1 active:scale-95"><SettingsIcon className="text-white"/></StyledTouchableOpacity>
                 </StyledView>
            </StyledView>

            <StyledView className="px-4 pb-4">
                 <StyledView className="relative">
                    <StyledView className="absolute left-3 top-1/2 -translate-y-2.5 z-10">
                        <SearchIcon className="text-muted-foreground" />
                    </StyledView>
                    <StyledView className="w-full h-10 bg-muted rounded-full pl-10 justify-center">
                        <StyledText className="text-muted-foreground">Search...</StyledText>
                    </StyledView>
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
