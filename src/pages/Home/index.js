import Weather from '../../components/Weather'
import styles from './Home.module.scss'
import Switch from '@mui/material/Switch'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFan } from '@fortawesome/free-solid-svg-icons'
import { Slider } from '@mui/material'
import { faSun } from '@fortawesome/free-regular-svg-icons'
import ReactApexChart from 'react-apexcharts'
import { useNavigate } from 'react-router-dom'

function Home() {
    // var options = {
    //     chart: {
    //         height: 280,
    //         type: 'radialBar',
    //     },
    //     series: [67],
    //     colors: ['#20E647'],
    //     plotOptions: {
    //         radialBar: {
    //             hollow: {
    //                 margin: 0,
    //                 size: '70%',
    //                 background: '#293450',
    //             },
    //             track: {
    //                 dropShadow: {
    //                     enabled: true,
    //                     top: 2,
    //                     left: 0,
    //                     blur: 4,
    //                     opacity: 0.15,
    //                 },
    //             },
    //             dataLabels: {
    //                 name: {
    //                     offsetY: -10,
    //                     color: '#fff',
    //                     fontSize: '13px',
    //                 },
    //                 value: {
    //                     color: '#fff',
    //                     fontSize: '30px',
    //                     show: true,
    //                 },
    //             },
    //         },
    //     },
    //     fill: {
    //         type: 'gradient',
    //         gradient: {
    //             shade: 'dark',
    //             type: 'vertical',
    //             gradientToColors: ['#87D4F9'],
    //             stops: [0, 100],
    //         },
    //     },
    //     stroke: {
    //         lineCap: 'round',
    //     },
    //     labels: ['Progress'],
    // }
    const navigate = useNavigate()

    const user = {
        name: 'Khanh',
        isLogged: true,
    }
    if (!user.isLogged) navigate('/signin')

    var period
    const hours = new Date().getHours()
    if (hours >= 4 && hours < 11) {
        period = 'morning'
    } else if (hours >= 11 && hours < 14) {
        period = 'afternoon'
    } else if (hours >= 14 && hours < 18) {
        period = 'evening'
    } else {
        period = 'night'
    }

    const [checkedFan, setCheckedFan] = useState(false)
    const [checkedLight, setCheckedLight] = useState(false)
    const [checkedAlarm, setCheckedAlarm] = useState(false)
    const [fanValue, setFanValue] = useState()
    const [lightValue, setLightValue] = useState()

    let dataHumid = [67],
        dataLight = [79],
        dataTemp = [34]
    let optionsHumid = {
        chart: {
            height: 350,
            type: 'radialBar',
            offsetY: -10,
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                dataLabels: {
                    name: {
                        fontSize: '16px',
                        color: undefined,
                        offsetY: 120,
                    },
                    value: {
                        offsetY: -10,
                        fontSize: '25px',
                        color: undefined,
                        formatter: function (val) {
                            return val + '%'
                        },
                    },
                },
            },
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                shadeIntensity: 0.15,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 50, 65, 91],
            },
        },
        stroke: {
            dashArray: 4,
        },
        labels: [''],
    }
    let optionsLight = {
        chart: {
            height: 350,
            type: 'radialBar',
            offsetY: -10,
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                dataLabels: {
                    name: {
                        fontSize: '16px',
                        color: undefined,
                        offsetY: 120,
                    },
                    value: {
                        offsetY: -10,
                        fontSize: '25px',
                        color: undefined,
                        formatter: function (val) {
                            return val + ' lux'
                        },
                    },
                },
            },
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                shadeIntensity: 0.15,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 50, 65, 91],
            },
        },
        stroke: {
            dashArray: 4,
        },
        labels: [''],
    }
    let optionsTemp = {
        chart: {
            height: 350,
            type: 'radialBar',
            offsetY: -10,
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                dataLabels: {
                    name: {
                        fontSize: '16px',
                        color: undefined,
                        offsetY: 120,
                    },
                    value: {
                        offsetY: -10,
                        fontSize: '40px',
                        color: undefined,
                        formatter: function (val) {
                            return val + ' °C'
                        },
                    },
                },
            },
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                shadeIntensity: 0.15,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 50, 65, 91],
            },
        },
        stroke: {
            dashArray: 4,
        },
        labels: [''],
    }

    return (
        <div className={styles.wrapper}>
            <div className={`${styles.container} ${styles.leftCol}`}>
                <Weather />
                <h4 style={{ margin: '20px 0 20px 20px', fontSize: '20pt' }}>Room temperature</h4>
                <ReactApexChart options={optionsTemp} series={dataTemp} type="radialBar" />
            </div>
            <div className={styles.rightCol}>
                <div className={`${styles.container} ${styles.userContainer} ${styles.container1}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h2 className={styles.hello}>Good {period}</h2>
                        <span className={styles.logoutBtn}>Logout</span>
                    </div>
                    <div className={styles.user}>
                        <img
                            src="https://res.cloudinary.com/des13gsgi/image/upload/v1658686670/avatar/a3yvp0a1gabjqwawgga8.webp"
                            alt="user"
                            className={styles.avatar}
                        />
                        <h2 className={styles.hello}>{user.name}</h2>
                    </div>
                </div>
                <div className={styles.deviceContainer}>
                    <div className={`${styles.container} ${styles.switchContainer} ${styles.fan}`}>
                        <div className={styles.headingAndSwitch}>
                            <h4 className={styles.switchHeading}>Fan</h4>
                            <Switch
                                checked={checkedFan}
                                onChange={(e) => setCheckedFan(e.target.checked)}
                                inputProps={{ 'aria-label': 'controlled' }}
                                style={{color: '#FFDF00'}}
                            />
                        </div>

                        <div className={styles.switchIcon}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faFan}
                                    style={{ color: '#FFDF00' }}
                                />{' '}
                                &nbsp; &nbsp;
                                <span style={{ color: '#FFDF00' }}>Strength</span>
                            </div>
                            <span style={{ width: '35px' }}>{fanValue}%</span>
                        </div>
                        <div
                            style={{
                                width: '94%',
                                margin: '10px auto 0 auto',
                            }}
                        >
                            <Slider
                                defaultValue={0}
                                aria-label="Default"
                                disabled={!checkedFan}
                                getAriaValueText={(value) => {
                                    setFanValue(value);
                                }}
                                sx={{
                                    color: checkedFan ? '#FFDF00' : 'grey.500',
                                }}
                            />
                        </div>
                    </div>
                    <div className={`${styles.container} ${styles.humidity}`} >
                        <h4 style = {{fontSize: '20pt'}}>Humidity</h4>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <ReactApexChart
                                options={optionsHumid}
                                series={dataHumid}
                                type="radialBar"
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.deviceContainer}>
                    <div className={`${styles.container} ${styles.switchContainer} ${styles.lightning}`}>
                        <div className={styles.headingAndSwitch}>
                            <h4 className={styles.switchHeading}>Lighting</h4>
                            <Switch
                                checked={checkedLight}
                                onChange={(e) => setCheckedLight(e.target.checked)}
                                inputProps={{ 'aria-label': 'controlled' }}
                                style={{color: '#0088FF'}}
                            />
                        </div>

                        <div className={styles.switchIcon}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faSun}
                                    style={{ color: '#0088FF' }}
                                />{' '}
                                &nbsp; &nbsp;
                                <span style={{ color: '#0088FF' }}>Intensity</span>
                            </div>
                            <span style={{ width: '35px' }}>{lightValue}%</span>
                        </div>
                        <div
                            style={{
                                width: '94%',
                                margin: '10px auto 0 auto',
                            }}
                        >
                            <Slider
                                defaultValue={0}
                                aria-label="Default"
                                disabled={!checkedLight}
                                getAriaValueText={(value) => {
                                    setLightValue(value);
                                }}
                                sx={{
                                    color: checkedLight ? '#0088FF' : 'grey.500',
                                }}
                            />
                        </div>
                    </div>
                    <div className={`${styles.container} ${styles.roomContainer} ${styles.roomBrightness}`}>
                        <h4 style = {{fontSize: '20pt'}}>Room brightness</h4>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <ReactApexChart
                                options={optionsLight}
                                series={dataLight}
                                type="radialBar"
                            />
                        </div>
                    </div>
                </div>
                <div className={`${styles.container} ${styles.alarmContainer} ${styles.theftAlarm}`}>
                    <h4>Theft Alarm</h4>
                    <div className={styles.switchAlarm}>
                        <Switch
                            checked={checkedAlarm}
                            onChange={(e) => setCheckedAlarm(e.target.checked)}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
