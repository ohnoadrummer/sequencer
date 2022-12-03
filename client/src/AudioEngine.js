import {useContext} from "react"
import {MusicParametersContext} from "./App.js"

const audioContext = new AudioContext()
const c2 = require("./assets/samples/oohc2.mp3")
const source = audioContext.createBufferSource()

let audio
// code creative
fetch(c2)
  .then((data) => {
    console.log(data)
    return data.arrayBuffer()
  })
  .then((arrayBuffer) => {
    console.log(arrayBuffer)

    return audioContext.decodeAudioData(arrayBuffer)
  })
  .then((decodedAudio) => {
    console.log(decodedAudio)
    audio = decodedAudio
  })

export const playback = (index, playing, rootNote, wonkFactor) => {
  // since we're using a sample of a C and basing our rootNote starting from A, we need to transpose down 3 semitones. this big number is = 2**(-3/12)
  const rootFrequency = 0.84089641525 * 2 ** (rootNote / 12)

  const scale = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24]
  const chordVoicing = [scale[index - 1], scale[index + 1], scale[index + 3]]
  chordVoicing.forEach((monophone) => {
    // https://zpl.fi/pitch-shifting-in-web-audio-api/
    const playSound = audioContext.createBufferSource()
    playSound.buffer = audio
    // our rootnote is A. our sample is C
    // so A is
    const note = rootFrequency * 2 ** (parseInt(monophone) / 12)
    const now = audioContext.currentTime
    playSound.playbackRate.value = note // (1.1/12) 1.075*
    // tone.type = "sine"
    // const synthGain = audioContext.createGain()
    // // shape the ADSR (attack, decay, sustain, release) envelope of the sound
    // // todo could easily set ADSR in FE as state variables
    // // todo filter, wave, etc
    // const attackTime = 0.037
    // const decayTime = 0.2
    // const sustainLevel = 0.0
    // const releaseTime = 0.0
    // const duration = 1
    // synthGain.gain.setValueAtTime(0, 0)
    // // increase or decrease gain based on the above ADSR values
    // synthGain.gain.linearRampToValueAtTime(0.3, now + attackTime)
    // synthGain.gain.linearRampToValueAtTime(
    //   sustainLevel,
    //   now + attackTime + decayTime
    // )
    // synthGain.gain.setValueAtTime(sustainLevel, now + duration - releaseTime)
    // synthGain.gain.linearRampToValueAtTime(0, now + duration)
    // tone.connect(synthGain)
    // synthGain.connect(audioContext.destination)

    if (playing) {
      setTimeout(() => {
        playSound.connect(audioContext.destination)
        playSound.start(now)
      }, Math.random() * wonkFactor)
      setTimeout(() => {
        // ! stopping the tone is necessary to keep the audioengine running else it eventually runs out of free oscillators
        playSound.stop()
      }, 4000)
    }
  })
}

export const PlayBeatChord = (index, playing, rootNote, wonkFactor) => {
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
