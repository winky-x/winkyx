
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Animated, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styled } from 'nativewind';
import { Svg, Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImageBackground = styled(ImageBackground);

const CORRECT_PIN = "1234";

const FingerprintIcon = (props) => (
    <Svg height="28" width="28" viewBox="0 0 24 24" {...props}>
        <Path fill="currentColor" d="M15.5 1h-7A1.5 1.5 0 0 0 7 2.5V9a.5.5 0 0 0 1 0V8h.5a.5.5 0 0 0 .5-.5V4a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-.5.5H12a2.5 2.5 0 0 0-2.5 2.5v.5a.5.5 0 0 0 1 0V15a1.5 1.5 0 0 1 1.5-1.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H11a1.5 1.5 0 0 1-1.5-1.5V9h-1V2.5A1.5 1.5 0 0 1 8.5 1h7A1.5 1.5 0 0 1 17 2.5V8h-1V3a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5H14a1.5 1.5 0 0 1 1.5 1.5v1.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h.5a2.5 2.5 0 0 1 2.5 2.5v2.5a.5.5 0 0 0 1 0V19a1.5 1.5 0 0 0-1.5-1.5h-.5a1.5 1.5 0 0 1-1.5-1.5v-3a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 0 1.5-1.5v-2a2.5 2.5 0 0 0-2.5-2.5H12a.5.5 0 0 1 0-1h1.5a3.5 3.5 0 0 1 3.5 3.5v2a.5.5 0 0 0 .5.5h.5a1.5 1.5 0 0 1 1.5 1.5v3a2.5 2.5 0 0 1-2.5 2.5H14a.5.5 0 0 0 0 1h1.5A3.5 3.5 0 0 0 19 19v-2.5a2.5 2.5 0 0 0-2.5-2.5H16v-1a.5.5 0 0 0-.5-.5h-1.5a.5.5 0 0 1-.5-.5v-3A2.5 2.5 0 0 1 15.5 7h.5a.5.5 0 0 0 .5-.5V2.5A1.5 1.5 0 0 0 15.5 1Z"/>
    </Svg>
);

const DeleteIcon = (props) => (
    <Svg height="28" width="28" viewBox="0 0 24 24" {...props}>
        <Path fill="currentColor" d="M19.5 12.5a.5.5 0 0 0 0-1H9.81l2.56-2.56a.5.5 0 0 0-.71-.71l-3.5 3.5a.5.5 0 0 0 0 .71l3.5 3.5a.5.5 0 0 0 .71-.71L9.81 12.5H19.5ZM4.5 5a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v3.5H5V6h14v3.5a.5.5 0 0 0 1 0V5.5a.5.5 0 0 0-.5-.5h-15Z"/>
    </Svg>
);


const KeypadButton = ({ onPress, children, textStyle }) => (
    <StyledTouchableOpacity
        className="h-16 w-16 rounded-full items-center justify-center bg-white/10 border border-white/30 backdrop-blur-sm shadow-lg active:bg-white/20"
        onPress={onPress}
    >
        <StyledText className={`text-2xl text-white/90 ${textStyle}`}>{children}</StyledText>
    </StyledTouchableOpacity>
);

const PinDot = ({ filled }) => (
    <StyledView
      className={`h-4 w-4 rounded-full border-2 transition-all duration-200 ${
        filled
          ? 'bg-accent border-accent/70'
          : 'bg-white/20 border-white/40 opacity-50 scale-90'
      }`}
    />
);


export default function LockScreen() {
    const [pin, setPin] = useState("");
    const navigation = useNavigation();
    const shakeAnimation = useRef(new Animated.Value(0)).current;

    const triggerShake = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true })
        ]).start();
    }

    useEffect(() => {
        if (pin.length === 4) {
            if (pin === CORRECT_PIN) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                navigation.navigate('ChatList', { showWelcomeToast: true });
            } else {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                triggerShake();
                setTimeout(() => setPin(""), 500);
            }
        }
    }, [pin, navigation]);

    const handleKeyPress = (key) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (pin.length < 4) {
            setPin(pin + key);
        }
    };
    
    const handleDelete = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setPin(pin.slice(0, -1));
    };

    const handleBiometric = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert("Biometric Auth", "Biometric authentication flow would be triggered here.");
    };

    return (
        <StyledImageBackground
            source={require('../../../assets/lock-screen-bg.png')}
            className="flex-1 items-center justify-center"
            resizeMode="cover"
        >
            <StyledView className="absolute inset-0 bg-black/60" />
            <Animated.View style={[{ transform: [{ translateX: shakeAnimation }] }]}>
                <StyledView className="w-full max-w-sm items-center justify-center p-8 space-y-8">
                    <StyledView className="text-center items-center">
                        <StyledText className="font-headline text-3xl font-bold text-white/90">Unlock WinkyX</StyledText>
                        <StyledText className="text-white/60 mt-1">Enter your PIN to access your messages.</StyledText>
                    </StyledView>

                    <StyledView className="flex-row justify-center items-center space-x-4 h-4">
                        {Array(4).fill(0).map((_, i) => <PinDot key={i} filled={pin.length > i} />)}
                    </StyledView>
                    
                    <StyledView className="grid grid-cols-3 gap-5 justify-items-center">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <KeypadButton key={num} onPress={() => handleKeyPress(String(num))} textStyle="font-sans">{num}</KeypadButton>
                        ))}
                         <KeypadButton onPress={handleBiometric}>
                            <FingerprintIcon className="text-white/70" />
                        </KeypadButton>
                        <KeypadButton onPress={() => handleKeyPress("0")} textStyle="font-sans">0</KeypadButton>
                        <KeypadButton onPress={handleDelete}>
                            <DeleteIcon className="text-white/70"/>
                        </KeypadButton>
                    </StyledView>
                </StyledView>
            </Animated.View>
        </StyledImageBackground>
    );
}
