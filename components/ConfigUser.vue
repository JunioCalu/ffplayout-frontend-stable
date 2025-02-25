<template>
    <div class="w-full max-w-[800px] pe-8">
        <h2 class="pt-3 text-3xl">User Configuration</h2>
        <div class="flex flex-col xs:flex-row gap-2 w-full mb-5 mt-10">
            <div class="grow">
                <select class="select select-bordered w-full max-w-xs" v-model="selected" @change="onChange($event)">
                    <option v-for="item in users">{{ item.username }}</option>
                </select>
            </div>
            <div class="flex-none join">
                <button class="join-item btn btn-primary" title="Add new User" @click="showUserModal = true">
                    Add User
                </button>
                <button class="join-item btn btn-primary" title="Delete selected user" @click="deleteUser()">
                    Delete
                </button>
            </div>
        </div>
        <form v-if="configStore.configUser" @submit.prevent="onSubmitUser">
            <label class="form-control w-full max-w-md">
                <div class="label">
                    <span class="label-text">Username</span>
                </div>
                <input
                    type="text"
                    placeholder="Name"
                    class="input input-bordered w-full !bg-base-100"
                    v-model="configStore.configUser.username"
                    disabled
                />
            </label>

            <label class="form-control w-full max-w-md mt-3">
                <div class="label">
                    <span class="label-text">Mail</span>
                </div>
                <input
                    type="email"
                    placeholder="mail"
                    class="input input-bordered w-full"
                    v-model="configStore.configUser.mail"
                />
            </label>

            <label class="form-control w-full max-w-md mt-3">
                <div class="label">
                    <span class="label-text">New Password</span>
                </div>
                <input
                    type="password"
                    placeholder="New password"
                    class="input input-bordered w-full"
                    v-model="newPass"
                />
            </label>

            <label class="form-control w-full max-w-md mt-3">
                <div class="label">
                    <span class="label-text">Confirm Password</span>
                </div>
                <input
                    type="password"
                    placeholder="Confirm password"
                    class="input input-bordered w-full"
                    v-model="confirmPass"
                />
            </label>

            <div>
                <button class="btn btn-primary mt-5" type="submit">Save</button>
            </div>
        </form>
    </div>

    <Modal :show="showUserModal" title="Add user" :modal-action="addUser">
        <div class="w-full max-w-[500px] h-[420px]">
            <label class="form-control w-full">
                <div class="label">
                    <span class="label-text">Username</span>
                </div>
                <input type="text" placeholder="Name" class="input input-bordered w-full" v-model="user.username" />
            </label>

            <label class="form-control w-full mt-3">
                <div class="label">
                    <span class="label-text">Mail</span>
                </div>
                <input type="email" placeholder="Mail" class="input input-bordered w-full" v-model="user.mail" />
            </label>

            <label class="form-control w-full mt-3">
                <div class="label">
                    <span class="label-text">Password</span>
                </div>
                <input
                    type="password"
                    placeholder="Password"
                    class="input input-bordered w-full"
                    v-model="user.password"
                />
            </label>

            <label class="form-control w-full mt-3">
                <div class="label">
                    <span class="label-text">Confirm Password</span>
                </div>
                <input
                    type="password"
                    placeholder="Password"
                    class="input input-bordered w-full"
                    v-model="user.confirm"
                />
            </label>

            <div class="form-control mt-3">
                <label class="label cursor-pointer w-20">
                    <span class="label-text">Admin</span>
                    <input type="checkbox" class="checkbox" v-model.number="user.admin" />
                </label>
            </div>
        </div>
    </Modal>
</template>

<script setup lang="ts">
const authStore = useAuth()
const configStore = useConfig()
const indexStore = useIndex()

const selected = ref(null)
const users = ref([] as User[])
const showUserModal = ref(false)
const newPass = ref('')
const confirmPass = ref('')

const user = ref({
    username: '',
    mail: '',
    password: '',
    confirm: '',
    admin: false,
    role_id: 2,
} as User)

onMounted(() => {
    getUsers()
})

async function getUsers() {
    fetch('/api/users', {
        method: 'GET',
        headers: authStore.authHeader,
    })
        .then((response) => response.json())
        .then((data) => {
            users.value = data
        })
}

function onChange(event: any) {
    selected.value = event.target.value

    getUserConfig()
}

async function getUserConfig() {
    let selectUser = configStore.currentUser

    if (user.value.username) {
        selectUser = user.value.username.toString()
    } else if (selected.value) {
        selectUser = selected.value
    }
    await fetch(`/api/user/${selectUser}`, {
        method: 'GET',
        headers: authStore.authHeader,
    })
        .then((response) => response.json())
        .then((data) => {
            configStore.configUser = data
        })
}

async function deleteUser() {
    if (configStore.configUser.username === configStore.currentUser) {
        indexStore.msgAlert('error', 'Delete current user not possible!', 2)
    } else {
        await fetch(`/api/user/${configStore.configUser.username}`, {
            method: 'DELETE',
            headers: authStore.authHeader,
        })
            .then(async () => {
                indexStore.msgAlert('success', 'Delete user done!', 2)

                await configStore.getUserConfig()
                await getUsers()
            })
            .catch((e) => {
                indexStore.msgAlert('error', `Delete user error: ${e}`, 2)
            })
    }
}

function clearUser() {
    user.value.username = ''
    user.value.mail = ''
    user.value.password = ''
    user.value.confirm = ''
    user.value.admin = false
    user.value.role_id = 2
}

async function addUser(add: boolean) {
    if (add) {
        if (user.value.admin) {
            user.value.role_id = 1
        } else {
            user.value.role_id = 2
        }

        delete user.value.admin

        if (user.value.password === user.value.confirm) {
            authStore.inspectToken()
            const update = await configStore.addNewUser(user.value)
            showUserModal.value = false

            if (update.status === 200) {
                indexStore.msgAlert('success', 'Add user success!', 2)

                await getUsers()
                await getUserConfig()
            } else {
                indexStore.msgAlert('error', 'Add user failed!', 2)
            }

            clearUser()
        } else {
            indexStore.msgAlert('error', 'Password mismatch!', 2)
        }
    } else {
        showUserModal.value = false
        clearUser()
    }
}

async function onSubmitUser() {
    if (newPass && newPass.value === confirmPass.value) {
        configStore.configUser.password = newPass.value
    }

    authStore.inspectToken()
    const update = await configStore.setUserConfig(configStore.configUser)

    if (update.status === 200) {
        indexStore.msgAlert('success', 'Update user profile success!', 2)
    } else {
        indexStore.msgAlert('error', 'Update user profile failed!', 2)
    }

    newPass.value = ''
    confirmPass.value = ''
}
</script>
