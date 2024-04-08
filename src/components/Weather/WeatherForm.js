import { useState } from "react";
import classNames from 'classnames/bind'
import styles from "./WeatherForm.module.scss";

const cx = classNames.bind(styles)
function WeatherForm({ onChangeCity }) {
    const [city, setCity] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        onChangeCity(city);
    }

    function onChange(e) {
        const value = e.target.value;
        if (value === " ") {
            alert("Please select a city");
        } else {
            setCity(value);
        }
    }

    return (
        <form className={cx('container-form')} onSubmit={handleSubmit} action="">
            <input
                className={cx('weatherSearch', 'input')}
                onChange={onChange}
                type="text"
                placeholder="Type a location"
            />
        </form>
    );
}

export default WeatherForm
