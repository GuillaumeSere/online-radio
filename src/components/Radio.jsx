import React, { useEffect, useState } from 'react'
import RadioBrowser from 'radio-browser'
import animation from './97959-music-visualizer.json'
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Player } from '@lottiefiles/react-lottie-player';
import defaultImage from "../radio.jpg";

const Radio = () => {
    const [stations, setStations] = useState();
    const [stationFilter, setStationFilter] = useState("all");
    const [currentStation, setCurrentStation] = useState(null);
    const [hoveredFilter, setHoveredFilter] = useState(null);

    useEffect(() => {
        setupApi(stationFilter).then((data) => {
            setStations(data);
        });
    }, [stationFilter]);

    useEffect(() => {
        let timer;
        if (currentStation) {
            timer = setTimeout(() => {
                // Redémarrer le flux après 5 minutes
                const audioPlayer = document.querySelector('.rhap_main-controls-button.rhap_play-pause-button');
                if (audioPlayer) {
                    audioPlayer.click();
                    setTimeout(() => audioPlayer.click(), 100);
                }
            }, 5 * 60 * 1000); // 5 minutes
        }
        return () => clearTimeout(timer);
    }, [currentStation]);

    const setupApi = async (stationFilter) => {
        const api = RadioBrowser

        const stations = await api
            .searchStations({
                language: "french",
                tag: stationFilter,
                limit: 40,
            })
            .then((data) => {
                return data;
            });

        return stations;
    };

    const filters = [
        { name: "all", image: require("../images/all.png") },
        { name: "classical", image: require("../images/classical.png") },
        { name: "country", image: require("../images/country.png") },
        { name: "dance", image: require("../images/dance.png") },
        { name: "disco", image: require("../images/disco.png") },
        { name: "house", image: require("../images/house.png") },
        { name: "jazz", image: require("../images/jazz.png") },
        { name: "pop", image: require("../images/pop.png") },
        { name: "rap", image: require("../images/rap.png") },
        { name: "retro", image: require("../images/retro.png") },
        { name: "rock", image: require("../images/rock.png") },
    ];

    const setDefaultSrc = (event) => {
        event.target.src = defaultImage;
    };

    // Fonction pour afficher les images à la place des noms
    const renderFilterImage = (filter) => {
        return (
            <img 
                src={filter.image} 
                alt={filter.name}
                style={{ width: '50px', height: '50px', borderRadius:'50%' }}
            />
        );
    };

    const handlePlay = (station) => {
        setCurrentStation(station);
    };

  return (
    <div className="radio">
            <div className="filters">
                <Player
                    autoplay
                    loop
                    src={animation}
                    className='animation-left'
                    style={{ height: '100px', width: '300px' }}
                >
                </Player>
                {filters.map((filter, index) => (
                    <span
                        key={index}
                        className={stationFilter === filter.name ? "selected" : ""}
                        onClick={() => setStationFilter(filter.name)}
                        onMouseEnter={() => setHoveredFilter(filter)}
                        onMouseLeave={() => setHoveredFilter(null)}
                    >
                        {renderFilterImage(filter)}
                    </span>
                ))}
                <Player
                    autoplay
                    loop
                    src={animation}
                    className="animation-right"
                    style={{ height: '100px', width: '300px' }}
                >
                </Player>
            </div>
            {hoveredFilter && (
                <div style={{
                    position: 'fixed',
                    top: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    zIndex: 1000
                }}>
                    {hoveredFilter.name}
                </div>
            )}
            <div className="stations">
                {stations &&
                    stations.map((station, index) => {
                        return (
                            <div className="station" key={index}>
                                <div className="stationName">
                                    <img
                                        className="logo"
                                        src={station.favicon}
                                        alt="station logo"
                                        onError={setDefaultSrc}
                                    />
                                    <div className="name">{station.name}</div>
                                </div>
                                <AudioPlayer
                                    className="player"
                                    src={station.url_resolved}
                                    showJumpControls={false}
                                    layout="stacked"
                                    customProgressBarSection={[]}
                                    customControlsSection={["MAIN_CONTROLS", "VOLUME_CONTROLS"]}
                                    autoPlayAfterSrcChange={false}
                                    onPlay={() => handlePlay(station)}
                                />
                            </div>
                        );
                    })}
            </div>
            <div className="footer">
                <p> &copy; guillaumesere.github.io/Online-Radio 2024,<span>Guillaume SERE </span></p>
            </div>
        </div>
  )
}

export default Radio
