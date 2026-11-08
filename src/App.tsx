import { useEffect, useRef, useState, useCallback } from 'react';

// Ссылки на изображения
const ИЗОБРАЖЕНИЯ = {
  ягода: 'https://image.qwenlm.ai/generated-images/b4ae2df6-b934-4bb0-bb21-a9fbe0d58297/_result.png',
  туманность: 'https://image.qwenlm.ai/generated-images/b350f059-f987-4dc6-88de-b3d4bdde468f/_result.png',
  ритуал: 'https://image.qwenlm.ai/generated-images/538a4824-f12d-42f7-868f-4dc4c76fb461/_result.png',
};

// Компонент частиц для героической секции
function Частицы() {
  const [частицы, setЧастицы] = useState<Array<{ id: number; x: number; y: number; размер: number; длительность: number; задержка: number; тип: 'звезда' | 'ягода' }>>([]);

  useEffect(() => {
    const предпочитаетДвижение = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (предпочитаетДвижение) return;

    const мобильный = window.innerWidth < 768;
    const количество = мобильный ? 20 : 50;

    const новыеЧастицы = Array.from({ length: количество }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      размер: Math.random() * 3 + 1,
      длительность: Math.random() * 15 + 10,
      задержка: Math.random() * 10,
      тип: Math.random() > 0.7 ? 'ягода' as const : 'звезда' as const,
    }));
    setЧастицы(новыеЧастицы);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {частицы.map((p) => (
        <div
          key={p.id}
          className="particle absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.размер}px`,
            height: `${p.размер}px`,
            backgroundColor: p.тип === 'ягода' ? '#9333EA' : '#E5DEFF',
            opacity: 0,
            animation: `${p.тип === 'ягода' ? 'float-drift' : 'float-up'} ${p.длительность}s ease-in-out ${p.задержка}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// Хук для анимации при прокрутке
function использоватьАнимациюПрокрутки() {
  const ссылка = useRef<HTMLDivElement>(null);
  const [видима, setВидима] = useState(false);

  useEffect(() => {
    const предпочитаетДвижение = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (предпочитаетДвижение) {
      setВидима(true);
      return;
    }

    const наблюдатель = new IntersectionObserver(
      ([запись]) => {
        if (запись.isIntersecting) {
          setВидима(true);
          наблюдатель.unobserve(запись.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ссылка.current) {
      наблюдатель.observe(ссылка.current);
    }

    return () => наблюдатель.disconnect();
  }, []);

  return { ссылка, видима };
}

// Обёртка анимированной секции
function АнимированнаяСекция({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ссылка, видима } = использоватьАнимациюПрокрутки();

  return (
    <div
      ref={ссылка}
      className={`transition-all duration-700 ease-out ${видима ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  );
}

// Героическая секция
function ГероическаяСекция() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #030712 0%, #0B1021 30%, #2D1B3D 70%, #4A0404 100%)',
      }}
    >
      <Частицы />
      
      {/* Радиальное свечение */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(147, 51, 234, 0.08) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-light leading-tight tracking-tight mb-8"
          style={{
            fontFamily: 'var(--font-heading)',
            background: 'linear-gradient(135deg, #F1F5F9 0%, #E2D8F0 50%, #E5DEFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Не предсказания.
          <br />
          <span className="italic font-light">Трансформация.</span>
        </h1>

        <p
          className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ color: '#E2D8F0', fontFamily: 'var(--font-body)' }}
        >
          Laboratorio Lampone — пространство архетипических практик,
          где внимание становится инструментом глубокой внутренней работы.
        </p>

        <a
          href="#заявка"
          className="inline-block px-10 py-4 text-sm font-medium tracking-widest uppercase transition-all duration-300 border hover:shadow-lg"
          style={{
            borderColor: '#C41E3A',
            color: '#F1F5F9',
            backgroundColor: 'transparent',
            fontFamily: 'var(--font-body)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#C41E3A';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(196, 30, 58, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Запросить доступ
        </a>
      </div>

      {/* Нижний градиент */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #030712, transparent)' }}
        aria-hidden="true"
      />
    </section>
  );
}

// Секция философии
function Философия() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden" style={{ backgroundColor: '#030712' }}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <АнимированнаяСекция className="lg:col-span-5 lg:col-start-1">
          <div className="relative">
            <img
              src={ИЗОБРАЖЕНИЯ.ягода}
              alt="Макрофотография чёрной ягоды на поверхности обсидиана"
              className="w-full h-auto object-cover rounded-sm"
              loading="lazy"
              style={{ boxShadow: '0 20px 60px rgba(45, 27, 61, 0.4)' }}
            />
            <div
              className="absolute inset-0 rounded-sm pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
              }}
              aria-hidden="true"
            />
          </div>
        </АнимированнаяСекция>

        <АнимированнаяСекция className="lg:col-span-6 lg:col-start-7">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-light mb-8 leading-tight"
            style={{ fontFamily: 'var(--font-heading)', color: '#F1F5F9' }}
          >
            Архитектура внимания
          </h2>
          <div className="space-y-6">
            <p className="text-base md:text-lg leading-relaxed" style={{ color: '#E2D8F0' }}>
              Мы работаем на пересечении архетипической психологии, символического ритуала
              и глубинной герменевтики. Каждая сессия — это выстроенное пространство,
              в котором символы обретают силу, а внимание — направление.
            </p>
            <p className="text-base md:text-lg leading-relaxed" style={{ color: '#E2D8F0' }}>
              Конфиденциальность — не обещание, а структурный принцип.
              Всё, что происходит в пространстве Laboratorio Lampone,
              остаётся в его пределах. Без записей. Без свидетелей. Без повторений.
            </p>
          </div>
          <div
            className="mt-10 w-16 h-px"
            style={{ background: 'linear-gradient(to right, #9333EA, transparent)' }}
            aria-hidden="true"
          />
        </АнимированнаяСекция>
      </div>
    </section>
  );
}

// Секция услуг
function Услуги() {
  const [открытаяУслуга, setОткрытаяУслуга] = useState<number | null>(null);

  const услуги = [
    {
      название: 'Натальная Карта',
      описание:
        'Глубинный астрологический разбор вашей натальной карты. Выявление сильных сторон, жизненных задач, кармических паттернов и потенциальных точек роста через символику планет и домов.',
      цена: '5 000 ₽',
      предоплата: '100% предоплата',
      подробноеОписание: 'Индивидуальная сессия глубокого анализа вашей натальной карты — астрологического портрета, составленного на момент вашего рождения. Мы работаем с символикой планет, знаков зодиака, домов и аспектов, выявляя ваши сильные стороны, жизненные задачи, кармические паттерны и потенциальные точки роста.',
      чтоВходит: [
        'Подготовка натальной карты (1-2 дня)',
        'Консультация (2-3 часа)',
        'Анализ личности и характера',
        'Выявление жизненных задач и предназначения',
        'Разбор кармических паттернов',
        'Письменный отчёт с рекомендациями',
      ],
      длительность: '2-3 часа',
      формат: 'Онлайн (Zoom/Skype) или очно',
      тарифы: [
        { название: 'Базовый', цена: '5 000 ₽', описание: 'Анализ личности, предназначения и кармических паттернов' },
        { название: 'Расширенный', цена: '8 000 ₽', описание: 'Базовый + разбор отношений, карьеры и здоровья' },
      ],
    },
    {
      название: 'Таро-Консультация',
      описание:
        'Работа с архетипическими образами Таро для ответа на конкретные вопросы или анализа жизненной ситуации. Глубинная интерпретация символов и их связи с вашим запросом.',
      цена: '5 000 ₽',
      предоплата: '100% предоплата',
      подробноеОписание: 'Индивидуальная консультация с использованием колоды Таро для ответа на конкретные вопросы или анализа жизненной ситуации. Мы работаем с архетипическими образами карт, выявляя скрытые динамики, потенциальные развития событий и глубинные смыслы вашей ситуации.',
      чтоВходит: [
        'Предварительное обсуждение запроса',
        'Расклад Таро (классический или индивидуальный)',
        'Глубинная интерпретация карт',
        'Анализ ситуации с разных ракурсов',
        'Рекомендации и стратегии',
        'Возможность уточняющих вопросов',
      ],
      длительность: '1.5-2 часа',
      формат: 'Онлайн (Zoom/Skype) или очно',
      тарифы: [
        { название: 'Один вопрос', цена: '5 000 ₽', описание: 'Глубинный анализ одного вопроса или ситуации' },
        { название: 'Комплексный расклад', цена: '10 000 ₽', описание: 'Разбор нескольких сфер жизни с детальным прогнозом' },
      ],
    },
    {
      название: 'Прогностическая Сессия',
      описание:
        'Комплексный прогноз на период с использованием астрологических транзитов, прогрессий и карт Таро. Стратегическое планирование с учётом космических циклов.',
      цена: '12 000 ₽',
      предоплата: '100% предоплата',
      подробноеОписание: 'Комплексная прогностическая сессия, объединяющая астрологический прогноз (транзиты, прогрессии, дирекции) и расклад Таро. Мы анализируем космические циклы на выбранный период (год, полугодие, квартал) и создаём стратегический план действий с учётом благоприятных и напряжённых моментов.',
      чтоВходит: [
        'Подготовка астрологического прогноза (2-3 дня)',
        'Консультация (3-4 часа)',
        'Анализ транзитов и прогрессий',
        'Расклад Таро на период',
        'Выявление ключевых моментов периода',
        'Стратегические рекомендации',
        'Письменный прогноз с датами',
        'Поддержка в течение месяца',
      ],
      длительность: '3-4 часа',
      формат: 'Онлайн (Zoom/Skype) или очно',
      тарифы: [
        { название: 'На квартал', цена: '12 000 ₽', описание: 'Прогноз на 3 месяца с ключевыми датами' },
        { название: 'На год', цена: '20 000 ₽', описание: 'Полный годовой прогноз с помесячным разбором' },
      ],
    },
    {
      название: 'Бизнес-Астрология',
      описание:
        'Астрологический анализ для бизнеса: выбор благоприятных дат, анализ совместимости партнёров, оптимизация командной работы. Стратегические решения с учётом космических циклов.',
      цена: '25 000 ₽',
      предоплата: '50% предоплата',
      подробноеОписание: 'Комплексная астрологическая поддержка для бизнеса. Мы анализируем натальные карты основателей и ключевых сотрудников, выявляем синергии и потенциальные конфликты, выбираем благоприятные даты для важных решений (регистрация компании, запуск продукта, подписание контрактов). Работаем с бизнес-циклами и космическими ритмами для оптимизации стратегических решений.',
      чтоВходит: [
        'Анализ натальных карт основателей (до 3 человек)',
        'Синастрический анализ партнёрств',
        'Выбор благоприятных дат (элективная астрология)',
        'Анализ команды и оптимизация ролей',
        'Стратегические рекомендации на год',
        'Письменный отчёт с датами и рекомендациями',
        'Консультация (3-4 часа)',
        'Поддержка в течение 3 месяцев',
      ],
      длительность: 'Подготовка 5-7 дней + консультация',
      формат: 'Онлайн или очно в офисе клиента',
      тарифы: [
        { название: 'Стандарт', цена: '25 000 ₽', описание: 'Анализ до 3 основателей + элективная астрология' },
        { название: 'Расширенный', цена: '40 000 ₽', описание: 'До 5 основателей + анализ команды + 6 месяцев поддержки' },
      ],
    },
    {
      название: 'Корпоративная Астрология',
      описание:
        'Астрологический аудит команды: анализ совместимости сотрудников, оптимизация распределения ролей, выявление лидерского потенциала. Улучшение командной динамики.',
      цена: '35 000 ₽',
      предоплата: '50% предоплата',
      подробноеОписание: 'Глубинный астрологический анализ вашей команды для оптимизации рабочих процессов и улучшения командной динамики. Мы анализируем натальные карты ключевых сотрудников, выявляем сильные стороны каждого, определяем оптимальное распределение ролей, находим потенциальные точки конфликтов и создаём стратегию улучшения взаимодействия в команде.',
      чтоВходит: [
        'Анализ натальных карт команды (до 10 человек)',
        'Синастрический анализ взаимодействий',
        'Оптимизация распределения ролей',
        'Выявление лидерского потенциала',
        'Рекомендации по улучшению коммуникации',
        'Стратегия разрешения конфликтов',
        'Письменный отчёт с профайлами',
        'Презентация для руководства (2 часа)',
        'Поддержка в течение 2 месяцев',
      ],
      длительность: 'Подготовка 7-10 дней + презентация',
      формат: 'Онлайн или очно в офисе',
      тарифы: [
        { название: 'До 10 человек', цена: '35 000 ₽', описание: 'Полный аудит команды + презентация для руководства' },
        { название: 'До 20 человек', цена: '60 000 ₽', описание: 'Расширенный аудит + тренинг для команды' },
      ],
    },
    {
      название: 'Стратегическое Планирование',
      описание:
        'Комплексное бизнес-планирование с интеграцией астрологических прогнозов. Долгосрочная стратегия развития с учётом космических циклов и бизнес-ритмов.',
      цена: '50 000 ₽',
      предоплата: '50% предоплата',
      подробноеОписание: 'Премиум-услуга для серьёзного бизнес-планирования. Мы создаём долгосрочную стратегию развития вашего бизнеса (1-3 года) с интеграцией астрологических прогнозов, анализом бизнес-циклов и космических ритмов. Это не просто прогноз — это полноценный стратегический документ с конкретными датами, рекомендациями и планом действий, адаптированный под вашу бизнес-модель и цели.',
      чтоВходит: [
        'Глубинный анализ бизнеса и рынка',
        'Астрологический прогноз на 1-3 года',
        'Анализ бизнес-циклов и сезонности',
        'Стратегический план развития',
        'Календарь благоприятных дат',
        'Рекомендации по масштабированию',
        'Анализ рисков и возможностей',
        'Письменная стратегия (30-50 страниц)',
        'Презентация для команды (3-4 часа)',
        'Квартальные корректировочные сессии',
        'Поддержка в течение года',
      ],
      длительность: 'Подготовка 2-3 недели + презентации',
      формат: 'Онлайн или очно с выездом',
    },
  ];

  return (
    <section className="relative py-32 md:py-40" style={{ backgroundColor: '#0B1021' }}>
      <div className="max-w-7xl mx-auto px-6">
        <АнимированнаяСекция className="text-center mb-20">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-light mb-4"
            style={{ fontFamily: 'var(--font-heading)', color: '#F1F5F9' }}
          >
            Практики
          </h2>
          <p className="text-sm md:text-base" style={{ color: '#E2D8F0' }}>
            Личные консультации и услуги для бизнеса
          </p>
          <div
            className="mt-6 mx-auto w-12 h-px"
            style={{ background: 'linear-gradient(to right, transparent, #C41E3A, transparent)' }}
            aria-hidden="true"
          />
        </АнимированнаяСекция>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {услуги.map((услуга, индекс) => (
            <АнимированнаяСекция key={индекс}>
              <article
                className="group relative p-8 md:p-10 h-full transition-all duration-300 cursor-pointer flex flex-col"
                style={{
                  backgroundColor: 'rgba(45, 27, 61, 0.3)',
                  border: '1px solid rgba(147, 51, 234, 0.3)',
                  borderRadius: '2px',
                }}
                onClick={() => setОткрытаяУслуга(индекс)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 40px rgba(196, 30, 58, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(196, 30, 58, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.3)';
                }}
              >
                <h3
                  className="text-2xl md:text-3xl font-light mb-6"
                  style={{ fontFamily: 'var(--font-heading)', color: '#F1F5F9' }}
                >
                  {услуга.название}
                </h3>
                <p className="text-sm md:text-base leading-relaxed mb-8" style={{ color: '#E2D8F0' }}>
                  {услуга.описание}
                </p>
                <div className="flex items-center justify-between mt-auto pt-6" style={{ borderTop: '1px solid rgba(147, 51, 234, 0.15)' }}>
                  <div>
                    <span
                      className="text-sm font-light tracking-wide block"
                      style={{ color: '#E5DEFF', fontFamily: 'var(--font-heading)' }}
                    >
                      {услуга.цена}
                    </span>
                    <span
                      className="text-xs tracking-wide"
                      style={{ color: '#9333EA' }}
                    >
                      {услуга.предоплата}
                    </span>
                  </div>
                  <button
                    className="text-xs tracking-widest uppercase transition-colors duration-300"
                    style={{ color: '#C41E3A', fontFamily: 'var(--font-body)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#E5DEFF'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#C41E3A'; }}
                  >
                    Подробнее →
                  </button>
                </div>
              </article>
            </АнимированнаяСекция>
          ))}
        </div>

        {/* Модальное окно */}
        {открытаяУслуга !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
            style={{ backgroundColor: 'rgba(3, 7, 18, 0.95)' }}
            onClick={() => setОткрытаяУслуга(null)}
          >
            <div
              className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              style={{
                backgroundColor: '#0B1021',
                border: '1px solid rgba(147, 51, 234, 0.4)',
                borderRadius: '2px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Кнопка закрытия */}
              <button
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center transition-colors duration-300"
                style={{ color: '#E2D8F0' }}
                onClick={() => setОткрытаяУслуга(null)}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#C41E3A'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#E2D8F0'; }}
                aria-label="Закрыть"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div className="p-8 md:p-12">
                {/* Заголовок */}
                <h3
                  className="text-3xl md:text-4xl font-light mb-6"
                  style={{ fontFamily: 'var(--font-heading)', color: '#F1F5F9' }}
                >
                  {услуги[открытаяУслуга].название}
                </h3>

                {/* Цена */}
                <div className="mb-8 pb-6" style={{ borderBottom: '1px solid rgba(147, 51, 234, 0.2)' }}>
                  <div className="flex items-baseline gap-4">
                    <span
                      className="text-2xl font-light"
                      style={{ color: '#E5DEFF', fontFamily: 'var(--font-heading)' }}
                    >
                      {услуги[открытаяУслуга].цена}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: '#9333EA' }}
                    >
                      {услуги[открытаяУслуга].предоплата}
                    </span>
                  </div>
                </div>

                {/* Подробное описание */}
                <div className="mb-8">
                  <h4
                    className="text-lg font-light mb-4"
                    style={{ fontFamily: 'var(--font-heading)', color: '#F1F5F9' }}
                  >
                    О практике
                  </h4>
                  <p className="text-sm md:text-base leading-relaxed" style={{ color: '#E2D8F0' }}>
                    {услуги[открытаяУслуга].подробноеОписание}
                  </p>
                </div>

                {/* Тарифы */}
                {услуги[открытаяУслуга].тарифы && (
                  <div className="mb-8">
                    <h4
                      className="text-lg font-light mb-4"
                      style={{ fontFamily: 'var(--font-heading)', color: '#F1F5F9' }}
                    >
                      Тарифы
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {услуги[открытаяУслуга].тарифы.map((тариф, индекс) => (
                        <div
                          key={индекс}
                          className="p-5"
                          style={{
                            backgroundColor: 'rgba(45, 27, 61, 0.3)',
                            border: '1px solid rgba(147, 51, 234, 0.3)',
                            borderRadius: '2px',
                          }}
                        >
                          <div className="flex items-baseline justify-between mb-2">
                            <span
                              className="text-base font-light"
                              style={{ fontFamily: 'var(--font-heading)', color: '#F1F5F9' }}
                            >
                              {тариф.название}
                            </span>
                            <span
                              className="text-lg font-light"
                              style={{ color: '#E5DEFF', fontFamily: 'var(--font-heading)' }}
                            >
                              {тариф.цена}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: '#E2D8F0' }}>
                            {тариф.описание}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Что входит */}
                <div className="mb-8">
                  <h4
                    className="text-lg font-light mb-4"
                    style={{ fontFamily: 'var(--font-heading)', color: '#F1F5F9' }}
                  >
                    Что входит
                  </h4>
                  <ul className="space-y-3">
                    {услуги[открытаяУслуга].чтоВходит.map((пункт, индекс) => (
                      <li key={индекс} className="flex items-start gap-3">
                        <span
                          className="text-sm mt-1"
                          style={{ color: '#C41E3A' }}
                        >
                          ◆
                        </span>
                        <span className="text-sm leading-relaxed" style={{ color: '#E2D8F0' }}>
                          {пункт}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Детали */}
                <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4
                      className="text-sm tracking-widest uppercase mb-2"
                      style={{ color: '#9333EA' }}
                    >
                      Длительность
                    </h4>
                    <p className="text-sm" style={{ color: '#E2D8F0' }}>
                      {услуги[открытаяУслуга].длительность}
                    </p>
                  </div>
                  <div>
                    <h4
                      className="text-sm tracking-widest uppercase mb-2"
                      style={{ color: '#9333EA' }}
                    >
                      Формат
                    </h4>
                    <p className="text-sm" style={{ color: '#E2D8F0' }}>
                      {услуги[открытаяУслуга].формат}
                    </p>
                  </div>
                </div>

                {/* Кнопка запроса */}
                <a
                  href="#заявка"
                  className="inline-block px-10 py-4 text-sm font-medium tracking-widest uppercase transition-all duration-300 border"
                  style={{
                    borderColor: '#C41E3A',
                    color: '#F1F5F9',
                    backgroundColor: 'transparent',
                    fontFamily: 'var(--font-body)',
                  }}
                  onClick={() => setОткрытаяУслуга(null)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#C41E3A';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(196, 30, 58, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Запросить доступ
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Секция условий предоплаты
function УсловияОплаты() {
  return (
    <section className="relative py-20 md:py-28" style={{ backgroundColor: '#030712' }}>
      <div className="max-w-4xl mx-auto px-6">
        <АнимированнаяСекция>
          <div
            className="p-8 md:p-12"
            style={{
              backgroundColor: 'rgba(45, 27, 61, 0.15)',
              border: '1px solid rgba(147, 51, 234, 0.2)',
              borderRadius: '2px',
            }}
          >
            <h3
              className="text-2xl md:text-3xl font-light mb-8 text-center"
              style={{ fontFamily: 'var(--font-heading)', color: '#F1F5F9' }}
            >
              Условия предоплаты
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span
                  className="text-sm font-light mt-1"
                  style={{ color: '#C41E3A', fontFamily: 'var(--font-heading)' }}
                >
                  01
                </span>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: '#E2D8F0' }}>
                  Все услуги предоставляются исключительно по предоплате. После одобрения заявки
                  мы отправляем инструкции по оплате удобным для вас способом.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <span
                  className="text-sm font-light mt-1"
                  style={{ color: '#C41E3A', fontFamily: 'var(--font-heading)' }}
                >
                  02
                </span>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: '#E2D8F0' }}>
                  Работа начинается только после подтверждения получения платежа.
                  Личные консультации — 100% предоплата. Бизнес-услуги — 50% предоплата, остаток после выполнения.
                  Стоимость услуг — 5 000 ₽, 8 000 ₽, 10 000 ₽, 12 000 ₽, 20 000 ₽, 25 000 ₽, 35 000 ₽, 40 000 ₽, 50 000 ₽, 60 000 ₽ в зависимости от выбранного тарифа.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <span
                  className="text-sm font-light mt-1"
                  style={{ color: '#C41E3A', fontFamily: 'var(--font-heading)' }}
                >
                  03
                </span>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: '#E2D8F0' }}>
                  Предоплата гарантирует ваше место в очереди и время на подготовку
                  индивидуальной работы. Возврат средств не предусмотрен.
                </p>
              </div>
            </div>
          </div>
        </АнимированнаяСекция>
      </div>
    </section>
  );
}

// Секция платёжного шлюза
function ПлатёжныйШлюз() {
  const [выбраннаяУслуга, setВыбраннаяУслуга] = useState('');
  const [сумма, setСумма] = useState('');
  const [загрузка, setЗагрузка] = useState(false);
  const [ошибка, setОшибка] = useState('');

  const услугиДляОплаты = [
    { название: 'Натальная Карта — Базовый', цена: '5000' },
    { название: 'Натальная Карта — Расширенный', цена: '8000' },
    { название: 'Таро-Консультация — Один вопрос', цена: '5000' },
    { название: 'Таро-Консультация — Комплексный расклад', цена: '10000' },
    { название: 'Прогностическая Сессия — Квартал', цена: '12000' },
    { название: 'Прогностическая Сессия — Год', цена: '20000' },
    { название: 'Бизнес-Астрология — Стандарт', цена: '25000' },
    { название: 'Бизнес-Астрология — Расширенный', цена: '40000' },
    { название: 'Корпоративная Астрология — До 10 человек', цена: '35000' },
    { название: 'Корпоративная Астрология — До 20 человек', цена: '60000' },
    { название: 'Стратегическое Планирование', цена: '50000' },
  ];

  const handleОплата = async () => {
    if (!выбраннаяУслуга || !сумма) {
      setОшибка('Пожалуйста, выберите услугу и укажите сумму');
      return;
    }

    setЗагрузка(true);
    setОшибка('');

    try {
      // Находим выбранную услугу для получения числового значения цены
      const выбраннаяУслугаОбъект = услугиДляОплаты.find(у => у.название === выбраннаяУслуга);
      const числоваяСумма = parseFloat(сумма);

      if (!выбраннаяУслугаОбъект) {
        throw new Error('Выбранная услуга не найдена');
      }

      // Отправляем запрос на создание платежа
      const response = await fetch('/api/create-payment.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: числоваяСумма,
          description: выбраннаяУслуга,
          service: выбраннаяУслуга,
        }),
      });

      const data = await response.json();

      if (data.success && data.confirmation_url) {
        // Перенаправляем на страницу оплаты ЮKassa
        window.location.href = data.confirmation_url;
      } else {
        throw new Error(data.error || 'Ошибка создания платежа');
      }
    } catch (err) {
      console.error('Ошибка оплаты:', err);
      setОшибка(err instanceof Error ? err.message : 'Произошла ошибка при создании платежа');
      setЗагрузка(false);
    }
  };

  return (
    <section className="relative py-20 md:py-28" style={{ backgroundColor: '#0B1021' }}>
      <div className="max-w-4xl mx-auto px-6">
        <АнимированнаяСекция>
          <div className="text-center mb-12">
            <h3
              className="text-2xl md:text-3xl font-light mb-4"
              style={{ fontFamily: 'var(--font-heading)', color: '#F1F5F9' }}
            >
              Оплата услуг
            </h3>
            <p className="text-sm" style={{ color: '#E2D8F0' }}>
              Безопасная оплата через платёжный шлюз ЮKassa
            </p>
          </div>

          <div
            className="p-8 md:p-10"
            style={{
              backgroundColor: 'rgba(45, 27, 61, 0.2)',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              borderRadius: '2px',
            }}
          >
            <div className="space-y-6">
              <div>
                <label className="block text-xs tracking-widest uppercase mb-3" style={{ color: '#E2D8F0' }}>
                  Выберите услугу
                </label>
                <select
                  value={выбраннаяУслуга}
                  onChange={(e) => {
                    setВыбраннаяУслуга(e.target.value);
                    // Автоматически заполняем сумму при выборе услуги
                    const выбраннаяУслугаОбъект = услугиДляОплаты.find(у => у.название === e.target.value);
                    if (выбраннаяУслугаОбъект) {
                      setСумма(выбраннаяУслугаОбъект.цена);
                    }
                  }}
                  className="w-full px-5 py-4 text-sm transition-all duration-300 outline-none appearance-none"
                  style={{
                    backgroundColor: '#111827',
                    border: '1px solid rgba(147, 51, 234, 0.3)',
                    color: '#F1F5F9',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <option value="" style={{ backgroundColor: '#111827' }}>Выберите услугу</option>
                  {услугиДляОплаты.map((услуга, индекс) => (
                    <option key={индекс} value={услуга.название} style={{ backgroundColor: '#111827' }}>
                      {услуга.название} — {parseInt(услуга.цена).toLocaleString('ru-RU')} ₽
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase mb-3" style={{ color: '#E2D8F0' }}>
                  Сумма к оплате (₽)
                </label>
                <input
                  type="number"
                  value={сумма}
                  onChange={(e) => setСумма(e.target.value)}
                  placeholder="Введите сумму"
                  min="100"
                  className="w-full px-5 py-4 text-sm transition-all duration-300 outline-none"
                  style={{
                    backgroundColor: '#111827',
                    border: '1px solid rgba(147, 51, 234, 0.3)',
                    color: '#F1F5F9',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-body)',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#C41E3A'; e.currentTarget.style.boxShadow = '0 0 20px rgba(196, 30, 58, 0.15)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.3)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>

              {ошибка && (
                <div
                  className="p-4 text-sm"
                  style={{
                    backgroundColor: 'rgba(196, 30, 58, 0.1)',
                    border: '1px solid rgba(196, 30, 58, 0.3)',
                    color: '#F1F5F9',
                    borderRadius: '2px',
                  }}
                >
                  {ошибка}
                </div>
              )}

              <div className="pt-4">
                <button
                  onClick={handleОплата}
                  disabled={загрузка}
                  className="w-full py-5 text-sm font-medium tracking-widest uppercase transition-all duration-300 border disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    borderColor: '#C41E3A',
                    color: '#F1F5F9',
                    backgroundColor: загрузка ? 'rgba(196, 30, 58, 0.3)' : 'transparent',
                    fontFamily: 'var(--font-body)',
                  }}
                  onMouseEnter={(e) => {
                    if (!загрузка) {
                      e.currentTarget.style.backgroundColor = '#C41E3A';
                      e.currentTarget.style.boxShadow = '0 0 40px rgba(196, 30, 58, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!загрузка) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  {загрузка ? 'Создание платежа...' : 'Перейти к оплате'}
                </button>
              </div>

              <div className="pt-6" style={{ borderTop: '1px solid rgba(147, 51, 234, 0.2)' }}>
                <div className="flex items-center justify-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <span className="text-xs" style={{ color: '#E2D8F0' }}>Безопасная оплата</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    <span className="text-xs" style={{ color: '#E2D8F0' }}>Защита данных</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-xs" style={{ color: '#E2D8F0' }}>PCI DSS</span>
                  </div>
                </div>
                <p className="text-xs text-center mt-4 leading-relaxed" style={{ color: 'rgba(226, 216, 240, 0.6)' }}>
                  Оплата производится через защищённый платёжный шлюз ЮKassa. 
                  Мы не храним данные ваших банковских карт.
                </p>
              </div>
            </div>
          </div>
        </АнимированнаяСекция>
      </div>
    </section>
  );
}

// Секция формы заявки
function ФормаЗаявки() {
  const [данныеФормы, setДанныеФормы] = useState({
    имя: '',
    email: '',
    цель: '',
    конфиденциальность: false,
    бюджет: '',
  });

  const [отправлено, setОтправлено] = useState(false);
  const [ошибка, setОшибка] = useState('');
  const [загрузка, setЗагрузка] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setОшибка('');
    setЗагрузка(true);
    
    try {
      // Отправка через PHP скрипт на хостинге
      const response = await fetch('/api/send-email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: данныеФормы.имя,
          email: данныеФормы.email,
          message: данныеФормы.цель,
          budget: данныеФормы.бюджет,
          confidentiality: данныеФормы.конфиденциальность,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setОтправлено(true);
        setДанныеФормы({
          имя: '',
          email: '',
          цель: '',
          конфиденциальность: false,
          бюджет: '',
        });
        
        // Отправка события в Google Analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'form_submit', {
            event_category: 'Заявка',
            event_label: данныеФормы.бюджет,
          });
        }
        
        // Отправка события в Яндекс.Метрику
        if (typeof window !== 'undefined' && (window as any).ym) {
          (window as any).ym(12345678, 'reachGoal', 'form_submit');
        }
      } else {
        throw new Error(data.error || 'Ошибка отправки');
      }
    } catch (err) {
      setОшибка('Произошла ошибка при отправке. Пожалуйста, напишите нам напрямую на reception@laboratoriolampone.com.ru');
      console.error('Ошибка отправки формы:', err);
    } finally {
      setЗагрузка(false);
    }
  }, [данныеФормы]);

  const стилиПоля: React.CSSProperties = {
    backgroundColor: '#111827',
    border: '1px solid rgba(147, 51, 234, 0.3)',
    color: '#F1F5F9',
    borderRadius: '2px',
    fontFamily: 'var(--font-body)',
  };

  return (
    <section
      id="заявка"
      className="relative py-32 md:py-40 noise-overlay"
      style={{
        background: 'linear-gradient(180deg, #0B1021 0%, #2D1B3D 50%, #0B1021 100%)',
      }}
    >
      <div className="relative z-10 max-w-2xl mx-auto px-6">
        <АнимированнаяСекция>
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-light mb-4"
              style={{ fontFamily: 'var(--font-heading)', color: '#F1F5F9' }}
            >
              Запросить доступ
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#E2D8F0' }}>
              Заполните форму. Мы рассматриваем каждый запрос индивидуально.
            </p>
          </div>

          {отправлено ? (
            <div
              className="p-8 text-center"
              style={{
                backgroundColor: 'rgba(45, 27, 61, 0.3)',
                border: '1px solid rgba(147, 51, 234, 0.3)',
                borderRadius: '2px',
              }}
            >
              <div className="mb-6">
                <svg
                  className="mx-auto"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C41E3A"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3
                className="text-2xl font-light mb-4"
                style={{ fontFamily: 'var(--font-heading)', color: '#F1F5F9' }}
              >
                Заявка отправлена
              </h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#E2D8F0' }}>
                Спасибо за ваш запрос. Мы свяжемся с вами в течение 48 часов
                на указанный email адрес.
              </p>
              <button
                onClick={() => setОтправлено(false)}
                className="text-xs tracking-widest uppercase transition-colors duration-300"
                style={{ color: '#C41E3A', fontFamily: 'var(--font-body)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#E5DEFF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#C41E3A'; }}
              >
                Отправить ещё одну заявку
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="имя" className="block text-xs tracking-widest uppercase mb-3" style={{ color: '#E2D8F0' }}>
                  Имя
                </label>
                <input
                  type="text"
                  id="имя"
                  name="name"
                  required
                  value={данныеФормы.имя}
                  onChange={(e) => setДанныеФормы({ ...данныеФормы, имя: e.target.value })}
                  className="w-full px-5 py-4 text-sm transition-all duration-300 outline-none"
                  style={стилиПоля}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#C41E3A'; e.currentTarget.style.boxShadow = '0 0 20px rgba(196, 30, 58, 0.15)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.3)'; e.currentTarget.style.boxShadow = 'none'; }}
                  placeholder="Ваше имя"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs tracking-widest uppercase mb-3" style={{ color: '#E2D8F0' }}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={данныеФормы.email}
                  onChange={(e) => setДанныеФормы({ ...данныеФормы, email: e.target.value })}
                  className="w-full px-5 py-4 text-sm transition-all duration-300 outline-none"
                  style={стилиПоля}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#C41E3A'; e.currentTarget.style.boxShadow = '0 0 20px rgba(196, 30, 58, 0.15)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.3)'; e.currentTarget.style.boxShadow = 'none'; }}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label htmlFor="цель" className="block text-xs tracking-widest uppercase mb-3" style={{ color: '#E2D8F0' }}>
                  Цель обращения
                </label>
                <textarea
                  id="цель"
                  name="message"
                  rows={4}
                  value={данныеФормы.цель}
                  onChange={(e) => setДанныеФормы({ ...данныеФормы, цель: e.target.value })}
                  className="w-full px-5 py-4 text-sm transition-all duration-300 outline-none resize-none"
                  style={стилиПоля}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#C41E3A'; e.currentTarget.style.boxShadow = '0 0 20px rgba(196, 30, 58, 0.15)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.3)'; e.currentTarget.style.boxShadow = 'none'; }}
                  placeholder="Опишите кратко, что привело вас к нам"
                />
              </div>

              <div>
                <label htmlFor="бюджет" className="block text-xs tracking-widest uppercase mb-3" style={{ color: '#E2D8F0' }}>
                  Бюджет
                </label>
                <select
                  id="бюджет"
                  name="budget"
                  value={данныеФормы.бюджет}
                  onChange={(e) => setДанныеФормы({ ...данныеФормы, бюджет: e.target.value })}
                  className="w-full px-5 py-4 text-sm transition-all duration-300 outline-none appearance-none"
                  style={{ ...стилиПоля, backgroundImage: `url("image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239333EA' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#C41E3A'; e.currentTarget.style.boxShadow = '0 0 20px rgba(196, 30, 58, 0.15)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.3)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <option value="" style={{ backgroundColor: '#111827' }}>Выберите услугу</option>
                  <option value="5000" style={{ backgroundColor: '#111827' }}>5 000 ₽</option>
                  <option value="8000" style={{ backgroundColor: '#111827' }}>8 000 ₽</option>
                  <option value="10000" style={{ backgroundColor: '#111827' }}>10 000 ₽</option>
                  <option value="12000" style={{ backgroundColor: '#111827' }}>12 000 ₽</option>
                  <option value="20000" style={{ backgroundColor: '#111827' }}>20 000 ₽</option>
                  <option value="25000" style={{ backgroundColor: '#111827' }}>25 000 ₽</option>
                  <option value="35000" style={{ backgroundColor: '#111827' }}>35 000 ₽</option>
                  <option value="40000" style={{ backgroundColor: '#111827' }}>40 000 ₽</option>
                  <option value="50000" style={{ backgroundColor: '#111827' }}>50 000 ₽</option>
                  <option value="60000" style={{ backgroundColor: '#111827' }}>60 000 ₽</option>
                </select>
              </div>

              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  id="конфиденциальность"
                  name="confidentiality"
                  required
                  checked={данныеФормы.конфиденциальность}
                  onChange={(e) => setДанныеФормы({ ...данныеФормы, конфиденциальность: e.target.checked })}
                  className="mt-1 w-4 h-4 accent-[#C41E3A] cursor-pointer"
                />
                <label htmlFor="конфиденциальность" className="text-xs leading-relaxed cursor-pointer" style={{ color: '#E2D8F0' }}>
                  Я подтверждаю понимание принципа конфиденциальности и принимаю условия работы
                  в пространстве Laboratorio Lampone. Вся информация остаётся строго в рамках практики.
                </label>
              </div>

              {ошибка && (
                <div
                  className="p-4 text-sm"
                  style={{
                    backgroundColor: 'rgba(196, 30, 58, 0.1)',
                    border: '1px solid rgba(196, 30, 58, 0.3)',
                    color: '#F1F5F9',
                    borderRadius: '2px',
                  }}
                >
                  {ошибка}
                </div>
              )}

              <button
                type="submit"
                disabled={загрузка}
                className="w-full py-5 text-sm font-medium tracking-widest uppercase transition-all duration-300 border disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: '#C41E3A',
                  color: '#F1F5F9',
                  backgroundColor: загрузка ? 'rgba(196, 30, 58, 0.3)' : 'transparent',
                  fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={(e) => {
                  if (!загрузка) {
                    e.currentTarget.style.backgroundColor = '#C41E3A';
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(196, 30, 58, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!загрузка) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {загрузка ? 'Отправка...' : 'Отправить запрос'}
              </button>
            </form>
          )}
        </АнимированнаяСекция>
      </div>
    </section>
  );
}

// Баннер согласия cookies
function БаннерCookies() {
  const [видим, setВидим] = useState(false);

  useEffect(() => {
    // Проверяем, давал ли пользователь согласие
    const согласие = localStorage.getItem('cookies_consent');
    if (!согласие) {
      // Показываем баннер с задержкой для плавной анимации
      setTimeout(() => setВидим(true), 1000);
    }
  }, []);

  const принять = () => {
    localStorage.setItem('cookies_consent', 'accepted');
    setВидим(false);
  };

  const отклонить = () => {
    localStorage.setItem('cookies_consent', 'rejected');
    setВидим(false);
  };

  if (!видим) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-fade-in-up"
      style={{
        background: 'linear-gradient(135deg, rgba(11, 16, 33, 0.98) 0%, rgba(45, 27, 61, 0.98) 100%)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(147, 51, 234, 0.3)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          {/* Иконка */}
          <div className="flex-shrink-0">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(196, 30, 58, 0.2), rgba(147, 51, 234, 0.2))',
                border: '1px solid rgba(147, 51, 234, 0.4)',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E5DEFF" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            </div>
          </div>

          {/* Текст */}
          <div className="flex-grow">
            <h3
              className="text-base md:text-lg font-light mb-2"
              style={{ fontFamily: 'var(--font-heading)', color: '#F1F5F9' }}
            >
              Мы используем cookies
            </h3>
            <p className="text-xs md:text-sm leading-relaxed" style={{ color: '#E2D8F0' }}>
              Этот сайт использует cookies для улучшения вашего опыта, аналитики и персонализации контента.
              Продолжая использовать сайт, вы соглашаетесь с нашей{' '}
              <a
                href="/privacy-policy.html"
                className="underline transition-colors duration-300"
                style={{ color: '#C41E3A' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#E5DEFF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#C41E3A'; }}
              >
                Политикой конфиденциальности
              </a>
              .
            </p>
          </div>

          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
            <button
              onClick={отклонить}
              className="px-6 py-3 text-xs font-medium tracking-widest uppercase transition-all duration-300 border"
              style={{
                borderColor: 'rgba(147, 51, 234, 0.4)',
                color: '#E2D8F0',
                backgroundColor: 'transparent',
                fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.8)';
                e.currentTarget.style.backgroundColor = 'rgba(147, 51, 234, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.4)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Отклонить
            </button>
            <button
              onClick={принять}
              className="px-6 py-3 text-xs font-medium tracking-widest uppercase transition-all duration-300 border"
              style={{
                borderColor: '#C41E3A',
                color: '#F1F5F9',
                backgroundColor: 'transparent',
                fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#C41E3A';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(196, 30, 58, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Принять
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Подвал сайта
function Подвал() {
  return (
    <footer className="relative py-16" style={{ backgroundColor: '#030712' }}>
      {/* Градиентный разделитель */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(147, 51, 234, 0.4), rgba(196, 30, 58, 0.4), transparent)' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <p
            className="text-lg font-light mb-4"
            style={{ fontFamily: 'var(--font-heading)', color: '#F1F5F9' }}
          >
            Laboratorio Lampone
          </p>
          <p className="text-xs tracking-wider mb-6" style={{ color: '#E2D8F0' }}>
            © {new Date().getFullYear()} Все права защищены
          </p>
          <p className="text-xs leading-relaxed max-w-lg mx-auto mb-4" style={{ color: 'rgba(226, 216, 240, 0.6)' }}>
            Услуги Laboratorio Lampone не являются медицинскими, психотерапевтическими
            или религиозными практиками. Все материалы и объекты предоставляются
            исключительно в культурно-символическом контексте.
          </p>
          <p className="text-xs" style={{ color: 'rgba(226, 216, 240, 0.6)' }}>
            reception@laboratoriolampone.com.ru
          </p>
        </div>
      </div>
    </footer>
  );
}

// Главное приложение
export default function App() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#030712' }}>
      <ГероическаяСекция />
      <Философия />
      <Услуги />
      <УсловияОплаты />
      <ПлатёжныйШлюз />
      <ФормаЗаявки />
      <Подвал />
      <БаннерCookies />
    </main>
  );
}
