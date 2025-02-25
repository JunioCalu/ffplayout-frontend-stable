import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

import { defineStore } from 'pinia'

dayjs.extend(utc)
dayjs.extend(timezone)

const { timeToSeconds } = stringFormatter()
const { processPlaylist } = playlistOperations()

export const usePlaylist = defineStore('playlist', {
    state: () => ({
        playlist: [] as PlaylistItem[],
        isLoading: false,
        listDate: dayjs().format('YYYY-MM-DD'),
        progressValue: 0,
        currentClip: 'No clip is playing',
        currentClipIndex: 0,
        currentClipStart: 0,
        currentClipDuration: 0,
        currentClipIn: 0,
        currentClipOut: 0,
        ingestRuns: false,
        remainingSec: 0,
        playoutIsRunning: false,
    }),

    getters: {},
    actions: {
        async getPlaylist(date: string) {
            const authStore = useAuth()
            const configStore = useConfig()
            const timeInSec = timeToSeconds(dayjs().utcOffset(configStore.utcOffset).format('HH:mm:ss'))
            const channel = configStore.configGui[configStore.configID].id
            let dateToday = dayjs().utcOffset(configStore.utcOffset).format('YYYY-MM-DD')

            if (configStore.startInSec > timeInSec) {
                dateToday = dayjs(dateToday).utcOffset(configStore.utcOffset).subtract(1, 'day').format('YYYY-MM-DD')
            }

            await fetch(`/api/playlist/${channel}?date=${date}`, {
                method: 'GET',
                headers: authStore.authHeader,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.program) {
                        this.playlist = processPlaylist(configStore.startInSec, configStore.playlistLength, data.program, false)
                    }
                })
                .catch(() => {
                    this.playlist = []
                })
        },

        async playoutStat() {
            const authStore = useAuth()
            const configStore = useConfig()
            const channel = configStore.configGui[configStore.configID].id

            await fetch(`/api/control/${channel}/media/current`, {
                method: 'GET',
                headers: authStore.authHeader,
            })
                .then((response) => {
                    if (response.status === 503) {
                        this.playoutIsRunning = false
                    }

                    return response.json()
                })
                .then((data) => {
                    if (data && data.played_sec) {
                        this.playoutIsRunning = true
                        this.currentClip = data.current_media.source
                        this.currentClipIndex = data.index
                        this.currentClipStart = data.start_sec
                        this.currentClipDuration = data.current_media.duration
                        this.currentClipIn = data.current_media.seek
                        this.currentClipOut = data.current_media.out
                        this.remainingSec = data.remaining_sec
                        this.ingestRuns = data.ingest_runs
                    }
                })
                .catch(() => {
                    this.playoutIsRunning = false
                })
        },
    },
})
