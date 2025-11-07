import { acceptHMRUpdate, defineStore } from "pinia";
import axios from "axios";

export const useArcGisMapStore = defineStore("arcGisMap", () => {
    const centerData = ref({
        longitude: 100.9925,
        latitude: 15.87
    });
    const searchData = ref({
        attributes: null,
        latitude: null,
        longitude: null
    });

    return {
        centerData,
        searchData,
    }
});
