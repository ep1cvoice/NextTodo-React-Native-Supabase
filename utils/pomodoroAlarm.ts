import { Audio } from 'expo-av';

const ALARM_SOURCE = require('../assets/sounds/ElectronicAlarmBuzzer.wav');

let sound: Audio.Sound | null = null;
let starting: Promise<void> | null = null;

async function ensureMode() {
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    allowsRecordingIOS: false,
    staysActiveInBackground: false,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  });
}

export async function playPomodoroAlarm() {
  if (starting) {
    await starting;
    return;
  }

  starting = (async () => {
    try {
      await stopPomodoroAlarm();
      await ensureMode();
      const { sound: next } = await Audio.Sound.createAsync(ALARM_SOURCE, {
        isLooping: true,
        volume: 1,
        shouldPlay: true,
      });
      sound = next;
    } catch {
      // Playback may fail on restricted web autoplay — modal still shows.
    } finally {
      starting = null;
    }
  })();

  await starting;
}

export async function stopPomodoroAlarm() {
  const current = sound;
  sound = null;
  if (!current) return;
  try {
    await current.stopAsync();
  } catch {
    // ignore
  }
  try {
    await current.unloadAsync();
  } catch {
    // ignore
  }
}
