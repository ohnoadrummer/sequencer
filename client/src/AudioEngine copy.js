import {useContext} from "react"
import {MusicParametersContext} from "./App.js"

const audioContext = new AudioContext()

// todo integrate melody
// export const PlayBeatMelody = (index, playing) => {
//   const rootFrequency = 220;
//   const note = rootFrequency * 2 ** (parseInt(index) / 12);
//   const tone = audioContext.createOscillator();
//   const now = audioContext.currentTime;
//   tone.frequency.value = note;
//   tone.type = "sine";
//   const synthGain = audioContext.createGain();
//   const attackTime = 0.037;
//   const decayTime = 0.2;
//   const sustainLevel = 0.0;
//   const releaseTime = 0.0;
//   const duration = 1;
//   synthGain.gain.setValueAtTime(0, 0);
//   // increase or decrease gain based on the above ADSR values
//   synthGain.gain.linearRampToValueAtTime(0.3, now + attackTime);
//   synthGain.gain.linearRampToValueAtTime(
//     sustainLevel,
//     now + attackTime + decayTime
//   );
//   synthGain.gain.setValueAtTime(sustainLevel, now + duration - releaseTime);
//   synthGain.gain.linearRampToValueAtTime(0, now + duration);
//   tone.connect(synthGain);
//   synthGain.connect(audioContext.destination);

//   if (playing) {
//     setTimeout(() => {
//       tone.start();
//     }, Math.random() * 1);
//   }
// };
export const PlayBeatChord = (index, playing, rootNote, wonkFactor) => {
  // !?! why does useContext break my playback and say invalid hook call?
  const rootFrequency = 220 * 2 ** (rootNote / 12) // instead of accessing a big object with note frequency values, we can just calculate them based off of A3 = 220Hz
  const scale = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24] // two octaves of the major scale, counted by # semitones away from the tonic
  // take index, voice chord based off the starting note of the scale
  const chordVoicing = [scale[index - 1], scale[index + 1], scale[index + 3]] // based off of index being a proper scale degree (1,2,3 etc), we need to minus one to
  // we want index, index+2, index+4 notes played.
  // ? this could be a state KEY as in major, minor, harmonic minor
  chordVoicing.forEach((monophone) => {
    const note = rootFrequency * 2 ** (parseInt(monophone) / 12)
    // 2^(12/12)
    // 0 = 1
    // 1/12, 1.0075

    // 440 is just a placehodlder thats going to C, D# or
    // octave / 12 = chromatic scale
    // major 1, 3, 5, 6, 8, 10, 11, 12
    // hard code skipping notes to create major scale
    // todo different note
    const tone = audioContext.createOscillator()
    const now = audioContext.currentTime
    const randomFreq = Math.random() * 500 + 100
    tone.frequency.value = note // (1.1/12) 1.075*
    tone.type = "sine"
    const synthGain = audioContext.createGain()
    // shape the ADSR (attack, decay, sustain, release) envelope of the sound
    // todo could easily set ADSR in FE as state variables
    // todo filter, wave, etc
    const attackTime = 0.037
    const decayTime = 0.2
    const sustainLevel = 0.0
    const releaseTime = 0.0
    const duration = 1
    synthGain.gain.setValueAtTime(0, 0)
    // increase or decrease gain based on the above ADSR values
    synthGain.gain.linearRampToValueAtTime(0.3, now + attackTime)
    synthGain.gain.linearRampToValueAtTime(
      sustainLevel,
      now + attackTime + decayTime
    )
    synthGain.gain.setValueAtTime(sustainLevel, now + duration - releaseTime)
    synthGain.gain.linearRampToValueAtTime(0, now + duration)
    tone.connect(synthGain)
    synthGain.connect(audioContext.destination)

    if (playing) {
      setTimeout(() => {
        tone.start()
      }, Math.random() * wonkFactor)
      setTimeout(() => {
        // ! stopping the tone is necessary to keep the audioengine running else it eventually runs out of free oscillators
        tone.stop()
      }, 4000)
    }
  })
}
