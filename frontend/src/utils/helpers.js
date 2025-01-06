import * as openpgp from "openpgp"
import JSzip from "jszip"


function downloadFile(file, filename) {
    const element = document.createElement("a")
    const url = URL.createObjectURL(file)

    element.href = url
    element.download = filename
    element.click()

    URL.revokeObjectURL(url)
}

export async function generateKeyPair(user) {
    const { privateKey: privateKeyArmored, publicKey: publicKeyArmored } = await openpgp.generateKey({
        type: "rsa",
        rsaBits: 4096,
        userIDs: [{ name: user.username}]
    })

    console.log({privateKeyArmored, publicKeyArmored})

    const text = "Hello, World! 213"

    const publicKey = await openpgp.readKey({armoredKey: publicKeyArmored})
    const privateKey = await openpgp.readPrivateKey({armoredKey: privateKeyArmored})
    const encryptedMessage = await openpgp.encrypt({
        message: await openpgp.createMessage({text}),
        encryptionKeys: publicKey
    })

    console.log({encryptedMessage})

    const decryptedMessage = await openpgp.decrypt({
        decryptionKeys: privateKey,
        message: await openpgp.readMessage({armoredMessage: encryptedMessage})
    })

    console.log({decryptedMessage})


    const zip = new JSzip()

    zip.file(`publicKeyArmored${user.username}.txt`, publicKeyArmored)
    zip.file(`privateKeyArmored${user.username}.txt`, privateKeyArmored)

    const content = await zip.generateAsync({type: "blob"})
    downloadFile(content, "keypair.zip")

}