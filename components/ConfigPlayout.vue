<template>
    <div class="max-w-[1200px] pe-8">
        <h2 class="pt-3 text-3xl">Playout Configuration</h2>
        <form
            v-if="configStore.configPlayout"
            @submit.prevent="onSubmitPlayout"
            class="mt-10 grid md:grid-cols-[140px_auto] gap-4"
        >
            <template v-for="(item, key) in configStore.configPlayout" :key="key">
                <div class="text-xl pt-3">{{ key }}:</div>
                <div class="md:pt-4">
                    <label
                        v-for="(prop, name) in (item as Record<string, any>)"
                        class="form-control w-full"
                        :class="[typeof prop === 'boolean' && 'flex-row', name.toString() !== 'help_text' && 'mt-2']"
                    >
                        <div class="label">
                            <span class="label-text !text-md font-bold">{{ name }}</span>
                        </div>
                        <div v-if="name.toString() === 'help_text'">{{ prop }}</div>
                        <input
                            v-else-if="name.toString() === 'sender_pass'"
                            type="password"
                            placeholder="Password"
                            class="input input-sm input-bordered w-full"
                            v-model="item[name]"
                        />
                        <textarea
                            v-else-if="name.toString() === 'output_param' || name.toString() === 'custom_filter'"
                            class="textarea textarea-bordered"
                            v-model="item[name]"
                            rows="3"
                        />
                        <input
                            v-else-if="typeof prop === 'number' && prop % 1 === 0"
                            type="number"
                            class="input input-sm input-bordered w-full"
                            v-model="item[name]"
                        />
                        <input
                            v-else-if="typeof prop === 'number'"
                            type="number"
                            class="input input-sm input-bordered w-full"
                            v-model="item[name]"
                            step="0.0001"
                            style="max-width: 250px"
                        />
                        <input
                            v-else-if="typeof prop === 'boolean'"
                            type="checkbox"
                            class="checkbox checkbox-sm ms-2 mt-2"
                            v-model="item[name]"
                        />
                        <input
                            v-else-if="name === 'ignore_lines'"
                            type="text"
                            class="input input-sm input-bordered w-full"
                            v-model="formatIgnoreLines"
                        />
                        <input
                            v-else
                            type="text"
                            class="input input-sm input-bordered w-full"
                            :id="name"
                            v-model="item[name]"
                        />
                    </label>
                </div>
            </template>
            <div class="mt-5 mb-10">
                <button class="btn btn-primary" type="submit">Save</button>
            </div>
        </form>
    </div>

    <Modal title="Restart Playout" text="Restart ffplayout to apply changes?" :show="showModal" :modalAction="restart" />
</template>

<script setup lang="ts">
const authStore = useAuth()
const configStore = useConfig()
const indexStore = useIndex()

const contentType = { 'content-type': 'application/json;charset=UTF-8' }

const showModal = ref(false)

const formatIgnoreLines = computed({
    get() {
        return configStore.configPlayout.logging.ignore_lines.join(';')
    },

    set(value) {
        configStore.configPlayout.logging.ignore_lines = value.split(';')
    },
})

async function onSubmitPlayout() {
    const update = await configStore.setPlayoutConfig(configStore.configPlayout)

    if (update.status === 200) {
        indexStore.msgAlert('success', 'Update playout config success!', 2)

        const channel = configStore.configGui[configStore.configID].id

        await $fetch(`/api/control/${channel}/process/`, {
            method: 'POST',
            headers: { ...contentType, ...authStore.authHeader },
            body: JSON.stringify({ command: 'status' }),
        }).then((response: any) => {
            if (response === 'active') {
                showModal.value = true
            }
        })
    } else {
        indexStore.msgAlert('error', 'Update playout config failed!', 2)
    }
}

async function restart(res: boolean) {
    if (res) {
        const channel = configStore.configGui[configStore.configID].id

        await $fetch(`/api/control/${channel}/process/`, {
            method: 'POST',
            headers: { ...contentType, ...authStore.authHeader },
            body: JSON.stringify({ command: 'restart' }),
        })
    }

    showModal.value = false
}
</script>
