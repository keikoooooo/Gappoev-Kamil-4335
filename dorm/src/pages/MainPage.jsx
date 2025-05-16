import React from 'react';
import '../index.css';
function Hero() {
    return (
        <section className="hero">
            <div className="info">
                <h1>ДОБРО ПОЖАЛОВАТЬ В СТУДЕНЧЕСКИЙ ГОРОДОК КНИТУ-КАИ</h1>
                <div className="per"></div>
                <p>Система учёта жильцов общежитий КНИТУ-КАИ (SARC) – инновационное решение, которое связывает 8 общежитий и помогает управляющим и жильцам эффективно организовывать проживание.</p>
            </div>
            <img className="camp_logo" src="/logo_camp1.png" alt="Логотип городка" />
        </section>
    );
}

// Компонент статистики
function Stats() {
    return (
        <div className="stats">
            <div className="stat-item">8 общежитий</div>
            <div className="stat-item">Более 3000 студентов</div>
            <div className="stat-item">Бальная система</div>
        </div>
    );
}

// Компонент информации об университете
function UniversityInfo() {
    return (
        <section className="university-info">
            <h2>КНИТУ-КАИ</h2>
            <ul>
                <li>Университет</li>
                <li>Наука и инновация</li>
                <li>Сотруднику</li>
                <li>Индий ТУ-146</li>
            </ul>
        </section>
    );
}

// Компонент информации о городке
function CampusInfo() {
    return (
        <section className="campus-info">
            <header>
                <div className="nav-head">
        <h1 className="stud">Студенческий городок КНИТУ-КАИ</h1>
      </div>
            </header>
            <h2>Студенческий городок</h2>
            <ul>
                <li>Директор</li>
                <li>Общежитие</li>
                <li>Документы</li>
                <li>Совет</li>
                <li>Служительский государственный</li>
                <li>Сообщества общежитий</li>
                <li>Общежитие №1</li>
                <li>Общежитие №2</li>
                <li>Общежитие №3</li>
                <li>Общежитие №4</li>
                <li>Общежитие №5</li>
                <li>Общежитие №6</li>
                <li>Общежитие №7</li>
            </ul>
        </section>
    );
}
function MainPage(){
    return(
        <section>
        <Hero />
        <Stats />
        <div className="container">
            <UniversityInfo />
            <CampusInfo />
        </div>
        </section>

    );
}
export default MainPage;
