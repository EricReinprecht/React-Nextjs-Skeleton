export const filesToBase64 = async (files: File[]): Promise<string[]> => {
    return await Promise.all(
        files.map(
            file => new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
              reader.readAsDataURL(file);
            })
        )
    );
};
