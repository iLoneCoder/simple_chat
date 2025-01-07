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

    const zip = new JSzip()

    zip.file(`publicKeyArmored${user.username}.txt`, publicKeyArmored)
    zip.file(`privateKeyArmored${user.username}.txt`, privateKeyArmored)

    const content = await zip.generateAsync({type: "blob"})
    downloadFile(content, "keypair.zip")

}


// when readAsText is called and text is read, reader.onload is called
// with the event and the state is updated
export async function handleFileRead(e, setFileContentState) {
    const file = e.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = async (e) => {
            setFileContentState(e.target.result)
        }
        reader.readAsText(file)  
    } else {
        setFileContentState("")
    }
}

// encrypt message
export async function encryptMessage(message, publicKeyArmored) {
    const publicKey = await openpgp.readKey({armoredKey: publicKeyArmored})
    const encryptedMessage = await openpgp.encrypt({
        message: await openpgp.createMessage({text: message}),
        encryptionKeys: publicKey
    })

    return encryptedMessage
}

// decrypt message
export async function decryptMessage(encryptedMessage, privateKeyArmored) {
    const privateKey  = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored })
    const decryptedMessage = await openpgp.decrypt({
        message: await openpgp.readMessage({ armoredMessage: encryptedMessage }),
        decryptionKeys: privateKey
    })

    return decryptedMessage.data
}