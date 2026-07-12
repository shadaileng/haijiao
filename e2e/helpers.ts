import { E2E } from './config'

export const noMirror = !E2E.mirrorDomain
export const noAuth = !(E2E.username && E2E.password)
export const noVideo = noAuth || !E2E.videoPid
