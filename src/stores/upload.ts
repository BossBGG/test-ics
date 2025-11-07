import { acceptHMRUpdate, defineStore } from "pinia";
import axios from "axios";

export const useUploadStore = defineStore("upload", () => {

  async function uploadFile(requestId: string, file: File): Promise<{ msg: string, path: string, result: true }> {
    const formData = new FormData();
    formData.append('imageFile', file);
    
    const { data } = await axios.post(`external/upload/${requestId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data;
  }

  return {
    uploadFile
  };
});

if (import.meta.hot)
  import.meta.hot.accept(
    acceptHMRUpdate(useServiceStore as any, import.meta.hot),
  );
