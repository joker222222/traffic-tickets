<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

interface Question {
  img: string
  questionId: number
  question: string
  answers: { answerText: string; isCorrect: boolean; isChoice: boolean }[]
  correctAnswer: string
  helpAnswer: string
}

/* https://github.com/etspring/pdd_russia/blob/master/questions/A_B/tickets/%D0%91%D0%B8%D0%BB%D0%B5%D1%82%2040.json */

interface Ticket {
  id: number
  questions: Question[]
}

const route = useRoute()
const ticket = ref<Ticket | null>(null)
const currentQuestionIndex = ref(0)
const showHelpMessage = ref(false)
const loadedImages = ref<Record<string, HTMLImageElement>>({})

const fetchTicket = async () => {
  ticket.value = {
    id: Number(route.params.id),
    questions: [
      {
        img: 'https://storage.yandexcloud.net/pddlife/no_picture.png',
        questionId: 1,
        question: 'В каком случае водитель совершит вынужденную остановку?',
        answers: [
          {
            answerText:
              'Остановившись непосредственно перед пешеходным переходом, чтобы уступить дорогу пешеходу',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText:
              'Остановившись на проезжей части из-за технической неисправности транспортного средства',
            isCorrect: true,
            isChoice: false,
          },
          {
            answerText: 'В обоих перечисленных случаях',
            isCorrect: false,
            isChoice: false,
          },
        ],
        correctAnswer:
          'Остановившись на проезжей части из-за технической неисправности транспортного средства',
        helpAnswer:
          '«Вынужденная остановка» - прекращение движения транспортного средства, связанное с его технической неисправностью, опасностью, создаваемой перевозимым грузом, состоянием водителя (пассажира) или появления препятствия на дороге.(Пункт 1.2 ПДД, термин «Вынужденная остановка»)',
      },
      {
        img: 'https://github.com/etspring/pdd_russia/blob/master/images/A_B/eca08a0e2b5ffcd12bdd8ffee34afcc3.jpg?raw=true',
        questionId: 2,
        question: 'Разрешен ли Вам поворот на дорогу с грунтовым покрытием?',
        answers: [
          {
            answerText: 'Разрешен',
            isCorrect: true,
            isChoice: false,
          },
          {
            answerText: 'Разрешен только при технической неисправности транспортного средства',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Запрещен',
            isCorrect: false,
            isChoice: false,
          },
        ],
        correctAnswer: 'Разрешен',
        helpAnswer:
          'Впереди по ходу Вашего движения предупреждающий знак 1.11.2 «Опасный поворот» и знаки 1.34.2 «Направление поворота», которые указывают направление движения на закруглении дороги малого радиуса с ограниченной видимостью. Ничего, что бы Вам запрещало поворот на дорогу с грунтовым покрытием, нет. По Вашему желанию поворачиваете направо.(«Дорожные знаки»).',
      },
      {
        img: 'https://github.com/etspring/pdd_russia/blob/master/images/A_B/5fa33b65fe52f38ad87c4b5226c5d3ba.jpg?raw=true',
        questionId: 3,
        question: 'Можно ли Вам остановиться в указанном месте для посадки пассажира?',
        answers: [
          {
            answerText: 'Можно',
            isCorrect: true,
            isChoice: false,
          },
          {
            answerText: 'Можно, если Вы управляете такси',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Нельзя',
            isCorrect: false,
            isChoice: false,
          },
        ],
        correctAnswer: 'Можно',
        helpAnswer:
          'Знак 3.28 «Стоянка запрещена» не запрещает производить остановку. В указанном месте Вам совершить остановку можно.(«Дорожные знаки»)',
      },
      {
        img: 'https://github.com/etspring/pdd_russia/blob/master/images/A_B/620fde366bcda9940db20a0019eeeeb4.jpg?raw=true',
        questionId: 4,
        question: 'Какие из указанных знаков запрещают движение водителям мопедов?',
        answers: [
          {
            answerText: 'Только А',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Только Б',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'В и Г',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Все',
            isCorrect: true,
            isChoice: false,
          },
        ],
        correctAnswer: 'Все',
        helpAnswer:
          'Запрещают движение водителям мопедов все знаки из перечисленных: А – 4.4.1 «Велосипедная дорожка»; Б – 5.14.1 «Полоса для маршрутных транспортных средств»; В – 4.5.2 «Пешеходная и велосипедная дорожка с совмещенным движением»; Г – 4.5.4 «Пешеходная и велосипедная дорожка с разделением движения».(Дорожные знаки)Только знак 5.14.2 «Полоса для велосипедистов» разрешает движение мопедов, но он не представлен в вопросеПункт 24.7 ПДД',
      },
      {
        img: 'https://github.com/etspring/pdd_russia/blob/master/images/A_B/92730be6f1618ab24232b6c3092607b5.jpg?raw=true',
        questionId: 5,
        question:
          'Вы намерены повернуть налево. Где следует остановиться, чтобы уступить дорогу легковому автомобилю?',
        answers: [
          {
            answerText: 'Перед знаком',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Перед перекрестком у линии разметки',
            isCorrect: true,
            isChoice: false,
          },
          {
            answerText: 'На перекрестке перед прерывистой линией разметки',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'В любом месте по усмотрению водителя',
            isCorrect: false,
            isChoice: false,
          },
        ],
        correctAnswer: 'Перед перекрестком у линии разметки',
        helpAnswer:
          'Согласно знаку 2.4 «Уступите дорогу» водители должны пропускать транспорт, движущийся по пересекаемой дороге. Разметка 1.13 в виде треугольников указывает место, где при необходимости следует остановиться. У Вас такая необходимость есть, так как при повороте налево Вы уступаете дорогу легковому автомобилю.(«Дорожные знаки», «Горизонтальная разметка»)',
      },
      {
        img: 'https://storage.yandexcloud.net/pddlife/no_picture.png',
        questionId: 6,
        question: 'Что означает мигание зелёного сигнала светофора?',
        answers: [
          {
            answerText: 'Предупреждает о неисправности светофора',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText:
              'Разрешает движение и информирует о том, что вскоре будет включен запрещающий сигнал',
            isCorrect: true,
            isChoice: false,
          },
          {
            answerText: 'Запрещает дальнейшее движение',
            isCorrect: false,
            isChoice: false,
          },
        ],
        correctAnswer:
          'Разрешает движение и информирует о том, что вскоре будет включен запрещающий сигнал',
        helpAnswer:
          'Длительность мигания зелёного сигнала светофора обычно составляет 3-4 с. Это позволяет водителю заблаговременно, в зависимости от конкретных условий, принять решение:1) продолжить движение с прежней скоростью;2) несколько увеличить скорость;3) начать снижение скорости вплоть до остановки.(Пункт 6.2 ПДД)',
      },
      {
        img: 'https://storage.yandexcloud.net/pddlife/no_picture.png',
        questionId: 7,
        question: 'Водитель обязан подавать сигналы световыми указателями поворота (рукой):',
        answers: [
          {
            answerText: 'Перед началом движения или перестроением',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Перед поворотом или разворотом',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Перед остановкой',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Во всех перечисленных случаях',
            isCorrect: true,
            isChoice: false,
          },
        ],
        correctAnswer: 'Во всех перечисленных случаях',
        helpAnswer:
          'Перед началом движения, перестроением, поворотом (разворотом) и остановкой водитель обязан подавать сигналы световыми указателями поворота соответствующего направления, а если они отсутствуют или неисправны – рукой. При выполнении манёвра не должны создаваться опасность для движения, а также помехи другим участникам дорожного движения.(Пункт 8.1 ПДД)',
      },
      {
        img: 'https://github.com/etspring/pdd_russia/blob/master/images/A_B/b61a6e1c048076e6b8ba01ef6e3ae2d1.jpg?raw=true',
        questionId: 8,
        question: 'Как Вам следует поступить при повороте направо?',
        answers: [
          {
            answerText: 'Перестроиться на правую полосу, затем осуществить поворот',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Продолжить движение по второй полосе до перекрёстка, затем повернуть',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Возможны оба варианта действий',
            isCorrect: true,
            isChoice: false,
          },
        ],
        correctAnswer: 'Возможны оба варианта действий',
        helpAnswer:
          'Разметка разрешает поворот направо с обеих полос, поэтому возможны оба варианта действий. В таких случаях, выполняя поворот на перекрёстке, соблюдайте избранную Вами рядность.(«Горизонтальная разметка» 1.18, пункт 8.5 ПДД)',
      },
      {
        img: 'https://github.com/etspring/pdd_russia/blob/master/images/A_B/0de3a44f154b8a1dc98c83ccb64a0c6c.jpg?raw=true',
        questionId: 9,
        question: 'По какой траектории Вам разрешено выполнить разворот?',
        answers: [
          {
            answerText: 'Только по А',
            isCorrect: true,
            isChoice: false,
          },
          {
            answerText: 'Только по Б',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'По любой из указанных',
            isCorrect: false,
            isChoice: false,
          },
        ],
        correctAnswer: 'Только по А',
        helpAnswer:
          'Выезд с пересечения проезжих частей должен быть выполнен на «свою» сторону, т.е. исходя из правостороннего движения без выезда на сторону встречного движения. Двигаясь по траектории «Б», Вы совершаете встречное движение по пересекаемой дороге, что крайне опасно, так как можете произвести лобовое столкновение с автомобилем, приближающимся слева. Развернуться следует по траектории «А».(Пункт 8.6 ПДД)',
      },
      {
        img: 'https://github.com/etspring/pdd_russia/blob/master/images/A_B/e25d143aa53eb44b06b020415b6bee54.jpg?raw=true',
        questionId: 10,
        question:
          'С какой скоростью Вы можете продолжить движение вне населённого пункта по левой полосе на легковом автомобиле?',
        answers: [
          {
            answerText: 'Не более 50 км/ч',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Не менее 50 км/ч и не более 70 км/ч',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Не менее 50 км/ч и не более 90 км/ч',
            isCorrect: true,
            isChoice: false,
          },
        ],
        correctAnswer: 'Не менее 50 км/ч и не более 90 км/ч',
        helpAnswer:
          'Над левой полосой висит знак 4.6 «Ограничение минимальной скорости» с табличкой 8.14 «Полоса движения», указывающей полосу движения, на которую распространяется действие знака. Скорость движения по левой полосе не должна быть менее 50 км/ч и не должна превышать допустимой для легковых автомобилей вне населённых пунктов, т.е. не более 90 км/ч.(«Дорожные знаки», пункт 10.3 ПДД)',
      },
      {
        img: 'https://github.com/etspring/pdd_russia/blob/master/images/A_B/573bb9e760618405e89c02b09f248404.jpg?raw=true',
        questionId: 11,
        question:
          'Можно ли водителю легкового автомобиля выполнить опережение грузовых автомобилей вне населенного пункта по такой траектории?',
        answers: [
          {
            answerText: 'Можно',
            isCorrect: true,
            isChoice: false,
          },
          {
            answerText: 'Можно, если скорость грузовых автомобилей менее 30 км/ч',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Нельзя',
            isCorrect: false,
            isChoice: false,
          },
        ],
        correctAnswer: 'Можно',
        helpAnswer:
          'На дорогах с двусторонним движением, имеющих четыре и более полос для движения обгон запрещён. В таких ситуациях можно совершать только опережение.Соблюдая правила маневрирования водитель легкового автомобиля на данном участке дороги может совершать опережение любых транспортных средств по различным траекториям включая и указанную.(Пункт 9.2 ПДД)',
      },
      {
        img: 'https://github.com/etspring/pdd_russia/blob/master/images/A_B/544ea7fd090765e47fa3b71f060b5f22.jpg?raw=true',
        questionId: 12,
        question:
          'В каком случае водителю разрешается поставить автомобиль на стоянку в указанном месте?',
        answers: [
          {
            answerText: 'Только если расстояние до сплошной линии разметки не менее 3 м',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Только если расстояние до края пересекаемой проезжей части не менее 5 м',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'При соблюдении обоих перечисленных условий',
            isCorrect: true,
            isChoice: false,
          },
        ],
        correctAnswer: 'При соблюдении обоих перечисленных условий',
        helpAnswer:
          'Водитель не нарушает правила остановки и стоянки. Расстояние до края проезжей части, до сплошной линии разметки соблюдается – не менее допустимых. Остановка и стоянка за пешеходным переходом также допустима.Правильный ответ – при соблюдении обоих перечисленных условий.(Пункт 12.4 ПДД)',
      },
      {
        img: 'https://github.com/etspring/pdd_russia/blob/master/images/A_B/3bca6590a23e621ade16916c7de64e44.jpg?raw=true',
        questionId: 13,
        question: 'При повороте направо Вы должны уступить дорогу:',
        answers: [
          {
            answerText: 'Только велосипедисту',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Только пешеходам',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Пешеходам и велосипедисту',
            isCorrect: true,
            isChoice: false,
          },
          {
            answerText: 'Никому',
            isCorrect: false,
            isChoice: false,
          },
        ],
        correctAnswer: 'Пешеходам и велосипедисту',
        helpAnswer:
          'При повороте направо или налево водитель обязан уступить дорогу пешеходам, переходящим проезжую часть дороги, на которую он поворачивает, лицам, использующим для передвижения средства индивидуальной мобильности (далее СИМ) и велосипедистам, независимо от того, регулируемый или нерегулируемый это перекресток.(Пункт 13.1 ПДД)',
      },
      {
        img: 'https://github.com/etspring/pdd_russia/blob/master/images/A_B/6a8f690af1b507fc0b56db742709f1e8.jpg?raw=true',
        questionId: 14,
        question:
          'Вы намерены проехать перекресток в прямом направлении. Кому Вы должны уступить дорогу?',
        answers: [
          {
            answerText: 'Обоим трамваям',
            isCorrect: true,
            isChoice: false,
          },
          {
            answerText: 'Только трамваю А',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Только трамваю Б',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Никому',
            isCorrect: false,
            isChoice: false,
          },
        ],
        correctAnswer: 'Обоим трамваям',
        helpAnswer:
          'Перекрёсток равнозначный. Трамваи в равнозначных условиях имеют преимущество перед безрельсовыми транспортными средствами. Между собой руководствуются «правилом правой руки». Помеха справа у трамвая «А». Соответственно первым проезжает трамвай «Б», за ним «А», Вы последним.(Пункт 13.11 ПДД)',
      },
      {
        img: 'https://github.com/etspring/pdd_russia/blob/master/images/A_B/dd7e958840da9ddd1c102a65d8d5c03f.jpg?raw=true',
        questionId: 15,
        question: 'Кому Вы обязаны уступить дорогу при повороте налево?',
        answers: [
          {
            answerText: 'Только автобусу',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Только легковому автомобилю',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Никому',
            isCorrect: true,
            isChoice: false,
          },
        ],
        correctAnswer: 'Никому',
        helpAnswer:
          'Перекрёсток неравнозначный. Главная дорога меняет направление. Транспортные средства, находящиеся на главной дороге, имеют преимущество, а водители между собой руководствуются «правилом правой руки». Никому не уступая, первым проезжаете Вы, вторым автобус, легковой автомобиль последним, так как он находится на второстепенной дороге.(«Дорожные знаки», пункты 13.9, 13.10, 13.11 ПДД)',
      },
      {
        img: 'https://github.com/etspring/pdd_russia/blob/master/images/A_B/0211b865b53f26534158a13f8886262f.jpg?raw=true',
        questionId: 16,
        question: 'С какой максимальной скоростью можно продолжить движение за знаком?',
        answers: [
          {
            answerText: '60 км/ч',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: '50 км/ч',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: '30 км/ч',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: '20 км/ч',
            isCorrect: true,
            isChoice: false,
          },
        ],
        correctAnswer: '20 км/ч',
        helpAnswer:
          'В жилой зоне, согласно знаку, в которую Вы въезжаете, разрешается движение со скоростью не более 20 км/ч.(«Дорожные знаки» 5.21, пункт 10.2 ПДД).',
      },
      {
        img: 'https://storage.yandexcloud.net/pddlife/no_picture.png',
        questionId: 17,
        question:
          'Для перевозки людей на мотоцикле водитель должен иметь водительское удостоверение на право управления транспортными средствами:',
        answers: [
          {
            answerText: 'Категории «A» или подкатегории «A1»',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Любой категории или подкатегории в течение 2 и более лет',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Только категории «A» или подкатегории «A1» в течение 2 и более лет',
            isCorrect: true,
            isChoice: false,
          },
        ],
        correctAnswer: 'Только категории «A» или подкатегории «A1» в течение 2 и более лет',
        helpAnswer:
          'Перевозка людей на мотоцикле должна осуществляться водителем, имеющим водительское удостоверение на право управления ТС категории «A» или подкатегории «A1» в течение 2 и более лет.(Пункт 22.2(1) ПДД)',
      },
      {
        img: 'https://storage.yandexcloud.net/pddlife/no_picture.png',
        questionId: 18,
        question: 'При какой неисправности разрешается эксплуатация транспортного средства?',
        answers: [
          {
            answerText: 'Не работают запорные устройства топливных баков',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText:
              'Не работают механизм регулировки и фиксирующее устройство сиденья водителя',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Не работает устройство обдува ветрового стекла',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Не работает стеклоподъемник',
            isCorrect: true,
            isChoice: false,
          },
        ],
        correctAnswer: 'Не работает стеклоподъемник',
        helpAnswer:
          'Перечисленные в ответах неисправности, за исключением неработающего стеклоподъёмника, указаны в «Перечне неисправностей». Неработающий стеклоподъемник в данном перечне не указан. Следовательно, это не может быть причиной запрещения эксплуатации транспортного средства. («Перечень неисправностей» п. 8.3, 9.2)',
      },
      {
        img: 'https://storage.yandexcloud.net/pddlife/no_picture.png',
        questionId: 19,
        question:
          'В случае, когда правые колёса автомобиля наезжают на неукреплённую влажную обочину, рекомендуется:',
        answers: [
          {
            answerText: 'Затормозить и полностью остановиться',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Затормозить и плавно направить автомобиль на проезжую часть',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText: 'Не прибегая к торможению, плавно направить автомобиль на проезжую часть',
            isCorrect: true,
            isChoice: false,
          },
        ],
        correctAnswer: 'Не прибегая к торможению, плавно направить автомобиль на проезжую часть',
        helpAnswer:
          'Такая ситуация опасна вследствие возникновения момента сил, стремящегося развернуть автомобиль. Старайтесь плавно вернуть автомобиль на проезжую часть не меняя скорости.',
      },
      {
        img: 'https://storage.yandexcloud.net/pddlife/no_picture.png',
        questionId: 20,
        question: 'Что понимается под временем реакции водителя?',
        answers: [
          {
            answerText:
              'Время с момента обнаружения водителем опасности до полной остановки транспортного средства',
            isCorrect: false,
            isChoice: false,
          },
          {
            answerText:
              'Время с момента обнаружения водителем опасности до начала принятия мер по её избежанию',
            isCorrect: true,
            isChoice: false,
          },
          {
            answerText:
              'Время, необходимое для переноса ноги с педали управления подачи топлива на педаль тормоза',
            isCorrect: false,
            isChoice: false,
          },
        ],
        correctAnswer:
          'Время с момента обнаружения водителем опасности до начала принятия мер по её избежанию',
        helpAnswer:
          'Под временем реакции водителя понимается время с момента обнаружения водителем опасности до начала принятия мер по её избежанию.Время реакции водителя - величина непостоянная. В основном зависит от возраста, самочувствия в данный момент. Компенсировать недостаток реакции можно снижением скорости.(«Техника управления автомобилем»)',
      },
    ],
  }
  await preloadImages(ticket.value.questions)
}

const preloadImages = async (questions: Question[]) => {
  const imageCache: Record<string, HTMLImageElement> = {}
  await Promise.all(
    questions.map(
      (q) =>
        new Promise<void>((resolve) => {
          const img = new Image()
          img.src = q.img
          img.onload = () => {
            imageCache[q.img] = img
            resolve()
          }
        }),
    ),
  )
  loadedImages.value = imageCache
}

const handleCheckAnswer = (answer: [], correctAnswer: string) => {
  if (correctAnswer == answer.answerText) {
    showHelpMessage.value = false
    nextQuestion()
  } else {
    answer.isChoice = true
    showHelpMessage.value = true
  }
}

const currentQuestion = computed(() =>
  ticket.value ? ticket.value.questions[currentQuestionIndex.value] : null,
)

const nextQuestion = () => {
  if (ticket.value && currentQuestionIndex.value < ticket.value.questions.length - 1) {
    showHelpMessage.value = false
    currentQuestionIndex.value++
  }
}

onMounted(fetchTicket)
</script>

<template>
  <div class="form-container" v-if="ticket && currentQuestion">
    <h1 class="tickets-number">Билет №{{ ticket?.id }}</h1>
    <div class="container">
      <h2>Вопрос №{{ currentQuestion.questionId }}</h2>
      <div>
        <img
          class="img-question"
          :src="loadedImages[currentQuestion.img]?.src || currentQuestion.img"
          alt="изображение"
        />
        <p class="questions">{{ currentQuestion.question }}</p>
      </div>
      <ul>
        <li v-for="answer in currentQuestion.answers" :key="answer">
          <button
            class="answer"
            :disabled="showHelpMessage"
            :class="
              showHelpMessage
                ? answer.isCorrect
                  ? 'answer-correct'
                  : answer.isChoice
                    ? 'answer-incorrect'
                    : ''
                : ''
            "
            @click="handleCheckAnswer(answer, currentQuestion.correctAnswer)"
          >
            {{ answer.answerText }}
          </button>
        </li>
      </ul>
      <div class="helpAnswer" v-if="showHelpMessage">{{ currentQuestion.helpAnswer }}</div>
      <button
        class="next-questions"
        @click="nextQuestion"
        :disabled="currentQuestionIndex === ticket.questions.length - 1"
      >
        Следующий вопрос
      </button>
    </div>
    <router-link to="/testing">Назад</router-link>
  </div>
</template>

<style scoped>
.form-container {
  margin: 0 auto;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin-top: 50px;
  width: 100%;
}

.tickets-number {
  font-size: 1.3rem;
  margin: 15px 0 15px 0;
  text-align: center;
}

li {
  list-style: none;
}
.container {
  display: block;
  margin: 0 auto;
  max-width: 800px;
  width: 100%;
  margin-top: 35px;
}

button {
  width: 100%;
  display: block;
  box-sizing: border-box;
}

.helpAnswer {
  max-width: 750px;
}

.questions {
  font-size: 1.3rem;
  max-width: 800px;
}

.img-question {
  max-width: 800px;
  width: 100%;
}

.answer {
  margin-top: 10px;
  max-width: 800px;
  padding: 10px;
  background-color: #aabacc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

ul {
  padding: 0;
}
.answer-correct {
  background-color: green;
}

.answer-incorrect {
  background-color: rgb(172, 0, 0);
}

.answer:hover:enabled {
  background-color: #2764aa;
}

.next-questions {
  margin-top: 10px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.next-questions:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
