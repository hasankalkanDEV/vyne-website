// Sadece web önizlemesi (site ekran görüntüleri) için eksik RN API'leri.
import { Appearance } from 'react-native';
if (!Appearance.setColorScheme) Appearance.setColorScheme = () => {};
