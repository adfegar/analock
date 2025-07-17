import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colorGreen, colorPink, colorPurple, colorWhite } from "../../constants/constants";
import { useCallback, useContext, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getStorageBooks, getStorageGamesData, getStorageUserData } from "../../services/storage.services";
import { getIntervalUserDiaryEntries } from "../../services/diaryEntries.services";
import { areDatesEqual } from "../../utils/date.utils";
import { SettingsContext } from "../../contexts/settingsContext";
import { useWipePeriodicContent } from "../../hooks/useWipePeriodicContent";


export const ProgressIcon: React.FC = () => {
    const [booksCompleted, setBooksCompleted] = useState<boolean>(false)
    const [gamesCompleted, setGamesCompleted] = useState<boolean>(false)
    const [diaryCompleted, setDiaryCompleted] = useState<boolean>(false)
    const wiped = useWipePeriodicContent()
    const settingsContext = useContext(SettingsContext);

    useFocusEffect(
        useCallback(() => {
            const bookData = getStorageBooks();
            const gameData = getStorageGamesData();
            if (bookData.length > 0) {
                setBooksCompleted(bookData.every(storageBook => storageBook.data && storageBook.data.finished))
            }
            if (gameData) {
                setGamesCompleted(gameData.every(storageGame => storageGame.won))
            }

            if (settingsContext !== null && settingsContext.settings.general.enableOnlineFeatures) {
                const userData = getStorageUserData()
                getIntervalUserDiaryEntries(userData.userId)
                    .then(diaryEntries => {
                        setDiaryCompleted(
                            diaryEntries.find(
                                diaryEntry =>
                                    areDatesEqual(new Date(), new Date(diaryEntry.registration.registrationDate))
                            ) !== undefined
                        )
                    })
                    .catch(error => console.error(`Error happened when getting user diary entries: ${error}`))
            }
        }, [wiped])
    );

    return (
        <View style={{ width: 60, height: 60 }}>
            <Svg width="60" height="60" viewBox="0 0 60 60" fill="none">

                {/* Top-right corner */}
                <Path
                    d="M36.1318 0C36.8424 0.144366 37.5465 0.314702 38.2432 0.512695C40.8158 1.21682 43.213 2.2187 45.4336 3.51855C47.6542 4.81845 49.6849 6.38997 51.5264 8.23145C53.3679 10.073 54.9393 12.1045 56.2393 14.3252C57.539 16.5457 58.541 18.9422 59.2451 21.5146C59.4656 22.2904 59.6517 23.0751 59.8057 23.8682H38.7061C37.2845 23.8682 36.1318 22.7155 36.1318 21.2939V0Z"
                    fill={colorWhite}
                    stroke={colorWhite}
                    strokeWidth="2"
                />

                {/* Top-left corner */}
                <Path
                    d="M0 23.771C0.14437 23.0604 0.314694 22.3563 0.512695 21.6597C1.21683 19.087 2.21868 16.6899 3.51855 14.4692C4.81846 12.2486 6.38995 10.218 8.23144 8.37646C10.073 6.5349 12.1045 4.96351 14.3252 3.66357C16.5457 2.36385 18.9422 1.3618 21.5146 0.657714C22.2904 0.437243 23.0751 0.251144 23.8682 0.0971669L23.8682 21.1968C23.8682 22.6183 22.7155 23.771 21.2939 23.771L0 23.771Z"
                    fill={diaryCompleted ? colorPurple : "none"}
                    stroke={diaryCompleted ? "none" : colorWhite}
                    strokeWidth="2"
                />

                {/* Bottom-left corner */}
                <Path
                    d="M23.771 59.8623C23.0604 59.7179 22.3564 59.5476 21.6597 59.3496C19.087 58.6455 16.6899 57.6436 14.4692 56.3437C12.2486 55.0438 10.218 53.4724 8.37647 51.6309C6.5349 49.7893 4.96351 47.7578 3.66358 45.5371C2.36384 43.3166 1.3618 40.9201 0.657717 38.3477C0.437243 37.5719 0.251149 36.7872 0.0971701 35.9941L21.1978 35.9941C22.6191 35.9944 23.771 37.147 23.771 38.5684L23.771 59.8623Z"
                    fill={booksCompleted ? colorGreen : "none"}
                    stroke={booksCompleted ? "none" : colorWhite}
                    strokeWidth="2"
                />

                {/* Bottom-right corner */}
                <Path
                    d="M60 36.0913C59.8556 36.8019 59.6853 37.506 59.4873 38.2026C58.7832 40.7753 57.7813 43.1725 56.4814 45.3931C55.1815 47.6137 53.61 49.6443 51.7686 51.4858C49.927 53.3274 47.8955 54.8988 45.6748 56.1987C43.4543 57.4985 41.0578 58.5005 38.4854 59.2046C37.7096 59.4251 36.9249 59.6112 36.1318 59.7651L36.1318 38.6655C36.1318 37.244 37.2845 36.0913 38.7061 36.0913L60 36.0913Z"
                    fill={gamesCompleted ? colorPink : "none"}
                    stroke={gamesCompleted ? "none" : colorWhite}
                    strokeWidth="2"
                />
            </Svg>
        </View>

    )
}