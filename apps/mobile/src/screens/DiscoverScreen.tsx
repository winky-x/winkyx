
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { ArrowLeft, RefreshCw, CheckCircle, Wifi, Bluetooth } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import * as comms from '../services/comms';
import type { DiscoveredPeer } from '../services/comms';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

const PeerCard = ({ peer, onConnect }: { peer: DiscoveredPeer; onConnect: (peer: DiscoveredPeer) => void }) => {
    return (
        <StyledTouchableOpacity
            onPress={() => onConnect(peer)}
            className="bg-card p-4 rounded-xl border border-border flex-row items-center justify-between active:bg-muted/50"
        >
            <StyledView>
                <StyledText className="text-foreground font-bold text-lg">{peer.name}</StyledText>
                <StyledText className="text-muted-foreground">Signal: {peer.signalStrength} dBm</StyledText>
            </StyledView>
            <StyledView className="flex-row items-center gap-2">
                <Wifi color="hsl(var(--foreground))" size={20} />
                <Bluetooth color="hsl(var(--foreground))" size={20} />
            </StyledView>
        </StyledTouchableOpacity>
    );
};


export default function DiscoverScreen() {
    const navigation = useNavigation();
    const [isScanning, setIsScanning] = useState(false);
    const [discoveredPeers, setDiscoveredPeers] = useState<DiscoveredPeer[]>([]);

    useEffect(() => {
        comms.initializeComms();
        handleScan();

        return () => {
            if (isScanning) {
                comms.stopDiscovery();
            }
        };
    }, []);

    const handleScan = () => {
        setDiscoveredPeers([]);
        setIsScanning(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        comms.startDiscovery((peer) => {
            setDiscoveredPeers(prevPeers => {
                // Avoid adding duplicates
                if (prevPeers.find(p => p.id === peer.id)) {
                    return prevPeers;
                }
                return [...prevPeers, peer];
            });
        });

        // Stop scanning after a timeout
        setTimeout(() => {
            setIsScanning(false);
            comms.stopDiscovery();
        }, 10000); // Scan for 10 seconds
    };
    
    const handleConnect = (peer: DiscoveredPeer) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // In a real app, we would navigate to a connecting screen
        // then to the chat screen upon successful connection.
        // For now, we'll navigate directly to a new chat.
        navigation.navigate('Chat', { chatName: peer.name, chatId: peer.id });
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            {/* Header */}
            <StyledView className="flex-row items-center p-4 border-b border-border">
                <StyledTouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                    <ArrowLeft color="hsl(var(--foreground))" size={24} />
                </StyledTouchableOpacity>
                <StyledText className="text-xl font-bold text-foreground ml-4">Discover Peers</StyledText>
                <StyledTouchableOpacity onPress={handleScan} disabled={isScanning} className="ml-auto p-2">
                    <RefreshCw color="hsl(var(--foreground))" size={24} className={isScanning ? 'animate-spin' : ''} />
                </StyledTouchableOpacity>
            </StyledView>
            
            <StyledScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
                {isScanning && (
                     <StyledView className="flex-row items-center justify-center gap-2 p-4">
                        <ActivityIndicator color="hsl(var(--primary))" />
                        <StyledText className="text-muted-foreground">Scanning for nearby devices...</StyledText>
                     </StyledView>
                )}
                
                {!isScanning && discoveredPeers.length === 0 && (
                     <StyledView className="items-center justify-center pt-20">
                        <StyledText className="text-foreground text-lg text-center">No Peers Found</StyledText>
                        <StyledText className="text-muted-foreground text-center mt-2">Make sure other devices have WinkyX open and are nearby. Tap the refresh icon to scan again.</StyledText>
                    </StyledView>
                )}

                {discoveredPeers.map(peer => (
                    <PeerCard key={peer.id} peer={peer} onConnect={handleConnect} />
                ))}
            </StyledScrollView>
        </SafeAreaView>
    );
}
