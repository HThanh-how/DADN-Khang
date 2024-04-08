import moment from 'moment'
import classNames from 'classnames/bind'
import styles from './WeatherDetails.module.scss'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const cx = classNames.bind(styles)
moment().format()
function WeatherDetails({ weather }) {
    return (
        <div className={cx('weather-container')}>
            <div className={cx('container-left')}>
                <img
                    className={cx('weather-icon')}
                    src={weather?.current.condition.icon}
                    alt={`Icon of ${weather?.location.country}`}
                />
            </div>

            <div className={cx('container-right')}>
                <h1 className={cx('weather-temp-main')}>{weather?.current.temp_c} °C</h1>
                <p className={cx('paragraph')}>
                    {weather?.location.name}, {weather?.location.country}
                </p>
            </div>
        </div>
    )
}

export default WeatherDetails
