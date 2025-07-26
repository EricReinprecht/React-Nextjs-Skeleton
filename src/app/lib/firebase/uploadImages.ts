import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadImagesToFirestore(files: File[], partyId: string): Promise<string[]> {
    const storage = getStorage();
    const urls: string[] = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileRef = ref(storage, `parties/${partyId}/image_${Date.now()}_${i}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        urls.push(url);
    }

    return urls;
}
