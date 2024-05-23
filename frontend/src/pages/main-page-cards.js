import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import 'swiper/swiper-bundle.css';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay} from 'swiper/modules';
SwiperCore.use(Navigation, Pagination, Scrollbar, A11y, Autoplay)


const MainPageCards = () => {
  const cards = [
    { id: 1, text: "🚀 Интерактивные инструменты: Обеспечьте вовлеченность и активное участие студентов с помощью наших интерактивных инструментов, способствующих эффективному обучению." },
    { id: 2, text: "🔒 Безопасность и конфиденциальность: мы ценим безопасность ваших данных, обеспечивая высокий уровень конфиденциальности и защиты на платформе." },
    { id: 3, text: "📊 Гибкий анализ: получайте уникальные аналитические данные о прогрессе проектов, оценках студентов и других ключевых аспектах для улучшения образовательного процесса." },
    { id: 4, text: "🌐 Удобство в использовании: Интуитивно понятный интерфейс и доступность на всех устройствах обеспечивают комфортное взаимодействие с платформой." },
  ];

  return (
    <div className="swiper-container">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={50}
        slidesPerView={3}
        loop = {true}
        autoplay = {{delay:3000, disableOnInteraction:false}}
        pagination = {true}
        navigation = {true}
        breakpoints={{
          1024: {
            slidesPerView: 3,
            spaceBetween: 50,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
        }}
      >
        {cards.map(card => (
          <SwiperSlide key={card.id}>
            <div className="card">
              <p style={{color:'var(--main-bg)'}}>{card.text}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default MainPageCards;
