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

    useEffect(() => {
        setupApi(stationFilter).then((data) => {
            setStations(data);
        });
    }, [stationFilter]);

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
        "all",
        "classical",
        "country",
        "dance",
        "disco",
        "house",
        "jazz",
        "pop",
        "rap",
        "retro",
        "rock",
    ];

    const setDefaultSrc = (event) => {
        event.target.src = defaultImage;
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
                        className={stationFilter === filter ? "selected" : ""}
                        onClick={() => setStationFilter(filter)}
                    >
                        {filter}
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
