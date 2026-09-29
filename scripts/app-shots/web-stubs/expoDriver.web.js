// Web önizlemesi için: SQLite yok, uygulama eski AsyncStorage yoluna düşer.
export async function openExpoDriver() { throw new Error('no sqlite on web preview'); }
