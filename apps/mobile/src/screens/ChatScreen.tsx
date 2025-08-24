
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { Svg, Path } from 'react-native-svg';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledTextInput = styled(TextInput);

// Mock Data
const initialMessages = [
    { id: '1', text: 'Hey there!', time: '9:30 PM', sentByCurrentUser: false },
    { id: '2', text: 'Hello! How are you?', time: '9:31 PM', sentByCurrentUser: true, status: 'read' },
    { id: '3', text: "I'm good, thanks! How about you? Did you see the new designs?", time: '9:31 PM', sentByCurrentUser: false },
    { id: '4', text: "Doing great! Yeah, I saw them. They look amazing! 🔥", time: '9:32 PM', sentByCurrentUser: true, status: 'read' },
];

// Icons
const ArrowLeftIcon = (props) => <Svg height="24" width="24" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12.707 17.707a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 0-1.414l5-5a1 1 0 0 1 1.414 1.414L8.414 12l4.293 4.293a1 1 0 0 1 0 1.414Z"/></Svg>;
const MoreVerticalIcon = (props) => <Svg height="24" width="24" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12 10.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0-12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/></Svg>;
const PlusIcon = (props) => <Svg height="24" width="24" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M11.5 12.5V18a.5.5 0 0 0 1 0v-5.5H18a.5.5 0 0 0 0-1h-5.5V6a.5.5 0 0 0-1 0v5.5H6a.5.5 0 0 0 0 1h5.5Z"/></Svg>;
const ArrowUpIcon = (props) => <Svg height="24" width="24" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m12 7.293 4.646 4.647a.5.5 0 0 0 .708-.707l-5-5a.5.5 0 0 0-.708 0l-5 5a.5.5 0 1 0 .708.707L12 7.293ZM12 18a.5.5 0 0 0 .5-.5v-10a.5.5 0 0 0-1 0v10a.5.5 0 0 0 .5.5Z"/></Svg>;
const CheckIcon = (props) => <Svg height="16" width="16" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m9.673 18.25-6.32-6.32a1.063 1.063 0 0 1 1.503-1.504L9.673 15.24l9.17-9.17a1.063 1.063 0 0 1 1.504 1.503l-10.67 10.67a1.062 1.062 0 0 1-1.504 0Z"/></Svg>;
const DoubleCheckIcon = (props) => <Svg height="16" width="16" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m18.17 8.871-7.855 7.855a1 1 0 0 1-1.414 0L5.586 13.41a1 1 0 0 1 1.414-1.414l2.608 2.608 7.147-7.147a1 1 0 1 1 1.414 1.414Zm-4.95 7.855L14.634 18a1 1 0 0 1-1.414 0L5.366 10.14a1 1 0 1 1 1.414-1.414l.707.707L5.586 7.53a1 1 0 0 1 1.414-1.414l7.856 7.855a1 1 0 0 1 0 1.414Z"/></Svg>;


const MessageBubble = ({ message }) => {
    const isSent = message.sentByCurrentUser;

    const StatusIcon = () => {
        if (!isSent) return null;
        if (message.status === 'read') return <DoubleCheckIcon className="text-blue-500" />;
        if (message.status === 'delivered') return <DoubleCheckIcon className="text-muted-foreground" />;
        return <CheckIcon className="text-muted-foreground" />;
    };

    return (
        <StyledView className={`flex w-full items-start gap-3 ${isSent ? 'justify-end' : 'justify-start'}`}>
            <StyledView className={`max-w-xs rounded-lg p-2.5 lg:max-w-md ${isSent ? 'bg-[#222E35]' : 'bg-[#202C33]'}`}>
                <StyledText className="text-sm text-white whitespace-pre-wrap">{message.text}</StyledText>
                <StyledView className="flex-row items-center justify-end gap-1.5 mt-1 h-4">
                    <StyledText className="text-xs text-muted-foreground">{message.time}</StyledText>
                    {isSent && <StatusIcon />}
                </StyledView>
            </StyledView>
        </StyledView>
    );
};

export default function ChatScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { chatName } = route.params;

    const [messages, setMessages] = useState(initialMessages);
    const [inputText, setInputText] = useState('');
    const scrollViewRef = useRef();

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const handleSendMessage = () => {
        if (inputText.trim()) {
            const newMessage = {
                id: String(messages.length + 1),
                text: inputText.trim(),
                time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
                sentByCurrentUser: true,
                status: 'sent',
            };
            setMessages([...messages, newMessage]);
            setInputText('');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-black text-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                {/* Header */}
                <StyledView className="flex-row shrink-0 items-center justify-between sticky top-0 bg-black z-10 border-b border-gray-800 p-2 h-14">
                    <StyledView className="flex-row items-center gap-2">
                        <StyledTouchableOpacity onPress={() => navigation.goBack()} className="h-9 w-9 rounded-full items-center justify-center active:bg-white/10 active:scale-95">
                            <ArrowLeftIcon className="text-white" />
                        </StyledTouchableOpacity>
                         <StyledView className="h-8 w-8 rounded-full bg-white/10 items-center justify-center">
                            <StyledText className="text-white font-bold">{chatName.charAt(0)}</StyledText>
                        </StyledView>
                    </StyledView>
                    <StyledView className="absolute left-1/2 top-1/2 -translate-x-12 -translate-y-3">
                        <StyledText className="font-medium text-sm text-white truncate">{chatName}</StyledText>
                    </StyledView>
                    <StyledTouchableOpacity className="h-9 w-9 rounded-full items-center justify-center active:bg-white/10 active:scale-95">
                        <MoreVerticalIcon className="text-white" />
                    </StyledTouchableOpacity>
                </StyledView>

                {/* Messages */}
                <StyledScrollView ref={scrollViewRef} className="flex-1" contentContainerStyle={{ padding: 16, gap: 16 }}>
                    {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
                </StyledScrollView>

                {/* Input */}
                <StyledView className="sticky bottom-0 bg-black z-20 pb-4 px-2 pt-2">
                    <StyledView className="flex-row rounded-xl bg-[#202C33] py-1 items-center">
                        <StyledTextInput
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Message"
                            placeholderTextColor="#8696a0"
                            multiline
                            className="flex-1 border-none bg-transparent min-h-[2rem] py-2 px-4 text-white placeholder:text-muted-foreground"
                        />
                        <StyledTouchableOpacity className="shrink-0 h-8 w-8 rounded-full items-center justify-center text-muted-foreground active:bg-white/10 active:scale-95 mr-2">
                            <PlusIcon className="text-white" />
                        </StyledTouchableOpacity>
                        <StyledTouchableOpacity onPress={handleSendMessage} className={`shrink-0 rounded-full h-8 w-8 p-1.5 active:scale-95 mr-2 ${inputText.trim() ? 'bg-white' : 'bg-transparent'}`}>
                             <ArrowUpIcon className={inputText.trim() ? 'text-black' : 'text-muted-foreground'} />
                        </StyledTouchableOpacity>
                    </StyledView>
                </StyledView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

