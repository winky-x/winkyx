
import BackgroundFetch from 'react-native-background-fetch';

/**
 * A "headless" task is a self-contained function that can run when the app is terminated.
 * This is where you would put your core sync logic.
 * @param event The event object containing the taskId.
 */
const headlessTask = async (event: { taskId: string }) => {
  console.log('[BackgroundFetch] Headless task start:', event.taskId);
  
  // --- YOUR SYNC LOGIC HERE ---
  // 1. Get message queue from DB.
  // 2. Scan for nearby peers.
  // 3. For each peer, attempt to connect and send queued messages.
  // 4. Update message status in DB.
  // -----------------------------

  console.log('[BackgroundFetch] Headless task finish:', event.taskId);
  BackgroundFetch.finish(event.taskId);
};

/**
 * Configures and starts the BackgroundFetch service.
 * This should be called once when the app initializes.
 */
export const configureBackgroundFetch = async () => {
  try {
    const status = await BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // Minimum interval in minutes. iOS will not execute tasks more frequently than this.
        stopOnTerminate: false,   // Set true to stop background-fetch from running in background
        startOnBoot: true,        // Auto start background tasks after device reboots
        enableHeadless: true,     // Run background-tasks after app is terminated.
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY, // Can run on any network
        requiresCharging: false,
        requiresDeviceIdle: false,
        requiresBatteryNotLow: false,
        requiresStorageNotLow: false,
      },
      async (taskId) => {
        console.log('[BackgroundFetch] Event received:', taskId);
        // --- Process your background task here ---
        // This is the same logic as the headless task, but runs when the app is in the background.
        await headlessTask({ taskId });
        BackgroundFetch.finish(taskId);
      },
      (taskId) => {
        // This is an optional error callback for timeout situations.
        console.error('[BackgroundFetch] Task TIMEOUT:', taskId);
        BackgroundFetch.finish(taskId);
      }
    );
    
    console.log('[BackgroundFetch] Configure success. Status:', status);

    // Register the headless task
    BackgroundFetch.registerHeadlessTask(headlessTask);

  } catch (e) {
    console.error('[BackgroundFetch] Configure failed:', e);
  }
};

/**
 * Manually triggers a background fetch event for testing.
 */
export const simulateBackgroundFetch = () => {
    BackgroundFetch.scheduleTask({
        taskId: "com.winkyx.test_task",
        delay: 500, // 0.5 seconds
        force: true,
        periodic: false,
    });
    console.log('[BackgroundFetch] Manual test task scheduled.');
};
