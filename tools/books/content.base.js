"use strict";
const BOOKS=[
{id:"anna",title:"Anna's New Home",author:"Короткий рассказ",level:"A1",hue:[18,160],chapters:[
{t:"A New City",x:`Anna is twenty-five years old. She is from a small town, but now she lives in a big city.

Her new flat is on the fifth floor. It has two rooms, a small kitchen and a big window. From the window, Anna can see the river and the old bridge.

On the first morning, Anna wakes up early. The sun is bright. She makes a cup of tea and sits by the window. The city is very quiet.

"I like it here," she says to herself.

Anna has a new job. She is a teacher. She teaches English to children. Her school is near the river, so she walks there every day.

In the evening, Anna goes to a small shop next to her house. She buys bread, cheese, apples and milk. The woman in the shop smiles at her.

"Are you new here?" the woman asks.

"Yes, I am," says Anna. "I live on the fifth floor."

"Welcome!" says the woman. "My name is Rosa. Come again!"`},
{t:"A Neighbour",x:`On Saturday morning, Anna hears music. It comes from the flat next to hers. Somebody is playing the guitar.

The music is beautiful. Anna stops and listens. She doesn't want to go out now.

In the afternoon, there is a knock on the door. Anna opens it. A tall young man is standing there. He has a cake in his hands.

"Hi! I'm Leo, your neighbour," he says. "I want to say hello. This cake is for you."

"Thank you!" says Anna. "Do you play the guitar? I heard music this morning."

Leo laughs. "Yes, that was me. Sorry, was it too loud?"

"No, no. It was lovely," Anna says. "Would you like some tea?"

They sit in the kitchen. They drink tea and eat the cake. Leo tells Anna about the city: the best park, the cheapest café and the old cinema by the bridge.

When Leo goes home, Anna looks out of the window. The lights on the bridge are on. The city doesn't feel so big now. She has a friend.`}]},
{id:"max",title:"Max the Little Robot",author:"Сказка",level:"A1",hue:[200,250],chapters:[
{t:"Max Wakes Up",x:`Max is a little robot. He is small and round, and he has big blue eyes. He lives in a workshop with an old man called Mr. Green.

Every morning, Mr. Green says, "Good morning, Max!" And Max says, "Good morning, Mr. Green!" in his funny metal voice.

Max can do many things. He can make coffee. He can clean the floor. He can find lost keys. But Max cannot read.

"What is a book?" Max asks one day.

Mr. Green smiles. He takes a red book from the shelf. "A book is full of stories," he says. "Stories about people, animals and other worlds."

Max looks at the book. He sees black lines and little marks. "I don't understand them," he says sadly.

"Then I will teach you," says Mr. Green.`},
{t:"Letters",x:`The lessons start the next day. Mr. Green writes a big letter on the board. "This is A," he says. "A for apple."

Max repeats, "A for apple." His eyes blink green. That means he is happy.

Every day, Max learns new letters. B for ball. C for cat. D for dog. Soon he knows all twenty-six letters.

Then he puts the letters together. C-A-T. "Cat!" says Max. D-O-G. "Dog!"

Mr. Green claps his hands. "Very good, Max! Now you can read words."

That night, Max does not go to sleep. He sits by the window and reads every word he can see: the names of the shops, the signs in the street and the numbers on the buses.`},
{t:"The First Story",x:`One morning, Mr. Green gives Max the red book. "Now you are ready," he says.

Max opens the book. The first page says: "Once upon a time, there was a brave little bird."

Max reads slowly. Sometimes he stops at a long word, and Mr. Green helps him. The bird in the story flies over mountains and seas. It is lost, but it is never afraid.

When Max reads the last page, his eyes are bright green.

"Mr. Green," he says, "the bird was small, like me. But it went very far."

"Yes," says Mr. Green. "Books can take you very far too."

From that day, Max reads one story every evening. And every evening, he goes somewhere new without leaving the workshop.`}]},
{id:"aesop",title:"Aesop's Fables",author:"Эзоп, пересказ",level:"A1–A2",hue:[38,10],chapters:[
{t:"The Lion and the Mouse",x:`A big lion is sleeping under a tree. A little mouse runs over his face. The lion wakes up. He is angry. He catches the mouse with his big paw.

"Please, let me go!" cries the mouse. "One day I can help you."

The lion laughs. "You are so small. How can you help me?" But he is not hungry, so he lets the mouse go.

A few days later, hunters catch the lion in a net. The lion roars, but he cannot get out.

The little mouse hears him. She runs to the net and starts to bite the ropes. She bites and bites, and soon the lion is free.

"You laughed at me," says the mouse. "Now you see: a little friend can be a great friend."

Moral: Little friends can be great friends.`},
{t:"The Fox and the Grapes",x:`One hot day, a fox is walking through a garden. She is very thirsty. Then she sees some grapes. They hang high on a vine. They are big, purple and sweet.

"Those grapes are just what I need," thinks the fox.

She jumps, but she cannot reach them. She runs and jumps again. Again she misses. She tries again and again, but the grapes are too high.

At last, the fox is tired. She sits down and looks at the grapes. Then she turns her nose up and walks away.

"I don't want them," she says. "They are probably sour."

Moral: It is easy to say you don't want something when you can't have it.`},
{t:"The Tortoise and the Hare",x:`A hare always laughs at a tortoise. "You are so slow!" he says. "Do you ever get anywhere?"

"Let's have a race," says the tortoise. "Then we will see."

The hare thinks this is very funny, but he says yes. All the animals come to watch.

The race begins. The hare runs very fast, and soon the tortoise is far behind. The hare stops and looks back. "That tortoise is so slow. I have time for a little sleep," he thinks. He lies down under a tree and closes his eyes.

The tortoise walks and walks. He doesn't stop. He walks past the sleeping hare.

When the hare wakes up, he runs as fast as he can. But it is too late. The tortoise is already at the finish line, and all the animals are cheering.

Moral: Slow and steady wins the race.`},
{t:"The Boy Who Cried Wolf",x:`A young boy looks after the sheep near his village. Every day is the same, and the boy is bored.

One day he has an idea. He runs to the village and shouts, "Wolf! Wolf! A wolf is chasing the sheep!"

The villagers run to help him. But there is no wolf. The boy laughs at them. The villagers are not happy, and they go home.

The next week, the boy does it again. "Wolf! Wolf!" he shouts. Again the villagers come, and again there is no wolf.

Then, one evening, a real wolf comes out of the forest. It runs towards the sheep. The boy is very scared. "Wolf! Wolf!" he shouts. "Please help! There really is a wolf!"

But this time nobody comes. The villagers think it is another joke.

Moral: Nobody believes a liar, even when he tells the truth.`},
{t:"The Ant and the Grasshopper",x:`It is summer. The sun is warm, and the fields are green. A grasshopper is singing and dancing in the grass.

An ant walks past. She is carrying a heavy piece of corn.

"Why are you working so hard?" asks the grasshopper. "Come and sing with me!"

"I am collecting food for the winter," says the ant. "You should do the same."

"Winter is a long way away," laughs the grasshopper. "We have lots of food now."

The ant says nothing and goes on working.

Then winter comes. The fields are white with snow. The grasshopper is cold and hungry. He has no food at all. He goes to the ants' house and asks for something to eat.

"What did you do all summer?" ask the ants.

"I sang," says the grasshopper.

"Well," say the ants, "now you can dance."

Moral: Work today, and you will have something tomorrow.`}]},
{id:"light",title:"The Lighthouse Keeper",author:"Рассказ",level:"A2",hue:[210,190],chapters:[
{t:"The Island",x:`Tom Harper had lived on the island for twelve years. It was a small, rocky place with no trees, only grass, birds and an old white lighthouse.

Tom was the lighthouse keeper. Every evening, just before the sun went down, he climbed the hundred and twenty steps to the top of the tower and switched on the great lamp. All night, the light turned slowly, and its long beam moved across the dark sea. Ships far away saw it and knew where the dangerous rocks were.

Tom liked his quiet life. He had a radio, a cat called Pepper and a lot of books. Once a month, a small boat brought him food, letters and newspapers from the town on the coast.

"Don't you feel lonely out here?" the boatman asked him once.

Tom thought for a moment. "Sometimes," he said. "But the sea is never the same two days in a row. It's like living next to a very old friend."`},
{t:"The Storm",x:`One night in November, a terrible storm came. The wind screamed around the tower, and huge waves crashed against the rocks. Rain hit the windows like stones.

At about midnight, the lamp went out.

Tom jumped out of his chair. Without the light, the ships could not see the rocks. He took his torch and ran up the stairs. At the top, he found the problem: water had got into the electrical box, and the main power was dead.

His hands were cold and wet, but he worked quickly. He switched to the old emergency generator in the basement. Nobody had used it for years. He pulled the starter once, twice, three times. Nothing happened.

"Come on," he whispered. "Please."

On the fourth try, the engine coughed and started. Tom ran back up the stairs, out of breath. Slowly, the great lamp began to glow, and then it began to turn.

Far out at sea, a small fishing boat was moving straight towards the rocks. Its captain suddenly saw the light, turned the wheel hard, and the boat passed safely into the open water.`},
{t:"A Letter",x:`Two weeks later, the supply boat arrived with Tom's food and a letter. The envelope was handwritten.

Tom opened it in the kitchen while Pepper sat on the table and watched him.

"Dear lighthouse keeper," the letter began. "My name is Elena Ross. On the night of the storm, I was on the fishing boat Sea Star with my father and my brother. Our engine was weak and our radio was broken. We were lost. Then we saw your light. If it had not been there, we would have hit the rocks. I don't know your name, but I wanted to say thank you. You saved three lives."

Tom read the letter twice. Then he put it carefully on the shelf, next to his favourite books.

That evening, he climbed the hundred and twenty steps as usual. When he switched on the lamp, he looked out at the dark water for a long time.

"Somebody is always out there," he said to Pepper. "That's why we keep the light on."`}]},
{id:"alice",title:"Alice in Wonderland",author:"Л. Кэрролл, адаптация",level:"A2–B1",hue:[290,330],chapters:[
{t:"Down the Rabbit Hole",x:`Alice was sitting by the river with her sister on a warm summer afternoon. Her sister was reading a book, but it had no pictures in it, and Alice was getting very bored.

Suddenly a White Rabbit with pink eyes ran past her. That was not very strange. But then the Rabbit took a watch out of his pocket, looked at it and said, "Oh dear! Oh dear! I shall be late!"

Alice jumped up. She had never seen a rabbit with a watch before. She ran across the field after him and saw him disappear into a large rabbit hole under a hedge.

Without thinking, Alice followed him.

The hole went straight down, like a very deep well. Alice fell, and fell, and fell. She fell so slowly that she had time to look around. The walls were covered with cupboards and bookshelves, maps and pictures.

"I wonder how many miles I've fallen," she said aloud. "Perhaps I will fall right through the Earth!"

At last she landed on a pile of dry leaves. She was not hurt at all. In front of her was a long hall with many doors, and at the end of it she saw the White Rabbit hurrying away.`},
{t:"The Little Door",x:`All the doors in the hall were locked. Alice walked sadly up and down, wondering how she would ever get out.

Then she found a little glass table. On it there was a tiny golden key. Behind a curtain, she discovered a very small door, only about forty centimetres high. The key fitted!

Alice opened the door and looked through it. On the other side was the most beautiful garden she had ever seen, full of bright flowers and cool fountains. But she could not even get her head through the doorway.

She went back to the table. Now there was a little bottle on it with a label that said DRINK ME.

Alice was a sensible girl, so first she checked that the bottle did not say "poison". It didn't, so she tasted it. It was delicious, like cherry pie, roast chicken and hot toast all at once.

"What a strange feeling!" said Alice. "I must be getting smaller!"

And she was. Soon she was just the right size for the little door. But when she ran to it, she remembered that the golden key was still on the table, high above her head.`},
{t:"The Pool of Tears",x:`Alice tried to climb up the leg of the table, but it was too slippery. At last, the poor little girl sat down and cried.

Then she noticed a small box under the table. Inside it there was a cake with the words EAT ME on it in raisins.

"Well, I'll eat it," said Alice. "If it makes me bigger, I can reach the key. If it makes me smaller, I can creep under the door."

She ate the cake, and very soon she began to grow. She grew and grew until her head hit the ceiling. Now she could take the key, but she was far too big for the garden door. This was even worse than before, and Alice began to cry again. She cried so much that her tears made a great pool around her.

Just then, the White Rabbit came back. He was wearing fine clothes and carrying a fan and a pair of white gloves. When he saw the giant Alice, he jumped in fright, dropped the fan and the gloves and ran away into the dark.

Alice picked up the fan and began to fan herself. To her surprise, she started to shrink again. She became so small that she slipped and fell, splash, into the pool of her own tears.

"I wish I hadn't cried so much!" said Alice, as she swam towards the shore.`}]},
{id:"train",title:"The Last Train",author:"Рассказ",level:"B1",hue:[150,100],chapters:[
{t:"Platform Nine",x:`It was almost midnight when Daniel reached the station. The last train to the coast left at 11:58, and the big clock above the platforms said 11:54. He ran down the stairs, his bag hitting his legs.

Platform nine was nearly empty. There was only one other passenger: an old woman in a green coat, sitting on a bench with a small suitcase beside her. She was holding a paper ticket in both hands, as if she was afraid the wind would take it.

The train arrived exactly on time. Daniel helped the woman with her suitcase, and they found two seats opposite each other in the empty carriage.

"Thank you, young man," she said. "My eyes aren't what they used to be. Is this definitely the train to Westport?"

"It is," said Daniel. "I'm going there too. I'm visiting my grandmother. She's been ill, and I haven't seen her for nearly two years."

The woman looked at him for a moment with a strange, soft expression. "Two years is a long time," she said. "Families should not wait so long."`},
{t:"Westport",x:`As the train moved through the dark countryside, they talked. The woman's name was Margaret. She had been a music teacher for forty years, and she was going to Westport to see the sea "one more time", as she put it.

Daniel told her about his job in the city, about the long hours and the small flat, and about how he was always promising to visit home "next month".

"Do you know what I've learnt?" Margaret said. "We think we have endless time. We say 'next month', 'next year'. But the people we love don't stay the same forever. Neither do we."

Daniel didn't answer. He looked out of the window at his own reflection.

When the train arrived at Westport, it was after two in the morning. Daniel carried Margaret's suitcase to the taxi stand.

"Will you be all right?" he asked.

"Perfectly," she smiled. "Now go. Your grandmother is waiting."

The next day, sitting next to his grandmother's bed, Daniel told her about the woman on the train. His grandmother listened with her eyes closed. Then she smiled.

"Margaret Hale?" she asked quietly. "She taught me to play the piano when I was a girl. She always said the same thing: don't wait for next month."

Daniel stared at her. Outside the window, the sea was shining in the morning sun.`}]}
];

const UNITS=[
{t:"Азы",d:"Звуки, местоимения, артикли, числа",c:"var(--primary)",ls:[
{id:"abc",t:"Алфавит и звуки",d:"26 букв и главные звуки",s:[
{h:"Буквы и звуки",p:"В английском <b>26 букв</b>: 5 гласных (a, e, i, o, u) и 21 согласная. Главная особенность: слова часто читаются не так, как пишутся. Поэтому у каждого слова в словаре есть <b>транскрипция</b> — запись звуков в квадратных скобках или между слешами.",ex:[["cat /kæt/","кошка"],["cake /keɪk/","торт"],["car /kɑː/","машина"]]},
{h:"Звуки, которых нет в русском",p:"<b>th</b> произносится с языком между зубами: глухо в <b>think</b> /θ/ и звонко в <b>this</b> /ð/. Буква <b>w</b> — губы трубочкой, как короткое «у». <b>sh</b> — как «ш», <b>ch</b> — как «ч».",ex:[["think","думать"],["this","это"],["water","вода"],["ship","корабль"],["chair","стул"]]},
{h:"Совет",p:"Нажимайте на кнопку динамика рядом с каждым словом и повторяйте вслух. В читалке звук есть у каждого слова."}],
q:[{q:"Сколько букв в английском алфавите?",o:["24","26","33"],a:1,e:"В английском алфавите 26 букв."},
{q:"Как звучит «th» в слове think?",o:["как «т»","язык между зубами, глухо","как «з»"],a:1,e:"Глухой межзубный звук /θ/."},
{q:"В каком слове есть звук «ш»?",o:["ship","chair","cat"],a:0,e:"sh = «ш»: ship."},
{q:"Сколько гласных букв?",o:["5","6","10"],a:0,e:"a, e, i, o, u (иногда y)."}]},
{id:"be",t:"Я, ты, он и глагол to be",d:"I am, you are, he is",s:[
{h:"Местоимения",p:"<b>I</b> — я (всегда с большой буквы), <b>you</b> — ты/вы, <b>he</b> — он, <b>she</b> — она, <b>it</b> — оно/это (предметы и животные), <b>we</b> — мы, <b>they</b> — они."},
{h:"Глагол to be — «быть, являться»",p:"В русском мы говорим «Я учитель», а в английском обязательно нужен глагол: <b>I am a teacher</b>. Форма зависит от местоимения:",tb:[["I","am","I'm"],["he / she / it","is","she's"],["you / we / they","are","we're"]],ex:[["I am happy.","Я счастлив."],["She is a teacher.","Она учитель."],["They are at home.","Они дома."]]},
{h:"Отрицание и вопрос",p:"Отрицание: добавьте <b>not</b> — I am not, she <b>isn't</b>, they <b>aren't</b>. Вопрос: поставьте глагол вперёд — <b>Are</b> you new here? <b>Is</b> it cold?",ex:[["Are you new here?","Вы здесь новенький?"],["It isn't cold.","Не холодно."]]}],
q:[{q:"She ___ a teacher.",o:["am","is","are"],a:1,e:"С he / she / it — is."},
{q:"We ___ friends.",o:["is","are","am"],a:1,e:"С we / you / they — are."},
{q:"___ you happy?",o:["Is","Am","Are"],a:2,e:"Вопрос с you: Are you…?"},
{q:"I ___ not tired.",o:["am","is","are"],a:0,e:"С I всегда am."}]},
{id:"art",t:"Артикли a, an, the",d:"Маленькие слова, которых нет в русском",s:[
{h:"a / an — «один, какой-то»",p:"Ставим перед исчисляемым существительным в единственном числе, когда говорим о нём впервые или о любом предмете. <b>an</b> — перед гласным <i>звуком</i>.",ex:[["a dog","(какая-то) собака"],["an apple","яблоко"],["an hour","час (h не читается)"]]},
{h:"the — «тот самый»",p:"Когда понятно, о каком именно предмете речь: уже упоминали, он единственный, или его видно.",ex:[["I saw a dog. The dog was big.","Я видел собаку. Эта собака была большая."],["the sun","солнце (единственное)"]]},
{h:"Без артикля",p:"Имена, города, языки, а также вещи «в общем»: <b>I like music.</b> <b>Dogs are friendly.</b>"}],
q:[{q:"I eat ___ apple every day.",o:["a","an","the"],a:1,e:"apple начинается с гласного звука → an."},
{q:"I have a cat. ___ cat is black.",o:["A","An","The"],a:2,e:"Кошку уже упомянули → the."},
{q:"It takes ___ hour.",o:["a","an","—"],a:1,e:"hour читается /aʊə/, первый звук гласный → an."},
{q:"I like ___ music.",o:["a","the","—"],a:2,e:"Музыка вообще — без артикля."}]},
{id:"pl",t:"Множественное число",d:"cat → cats, child → children",s:[
{h:"Обычное правило",p:"Добавляем <b>-s</b>: cat → cats, book → books. После s, x, ch, sh, o — <b>-es</b>: box → boxes, bus → buses, tomato → tomatoes."},
{h:"Буква y",p:"Согласная + y → <b>-ies</b>: baby → babies, city → cities. Гласная + y → просто -s: day → days, boy → boys."},
{h:"Исключения",p:"Их нужно запомнить:",tb:[["man","men","мужчины"],["woman","women","женщины"],["child","children","дети"],["foot","feet","ступни"],["tooth","teeth","зубы"],["mouse","mice","мыши"]]}],
q:[{q:"box → ?",o:["boxs","boxes","boxies"],a:1,e:"После x → -es."},
{q:"baby → ?",o:["babys","babies","babyes"],a:1,e:"Согласная + y → ies."},
{q:"child → ?",o:["childs","childes","children"],a:2,e:"Исключение: children."},
{q:"day → ?",o:["days","daies","dayes"],a:0,e:"Гласная + y → просто -s."}]},
{id:"num",t:"Числа и время",d:"От one до hundred, который час",s:[
{h:"Числа",p:"1–10: one, two, three, four, five, six, seven, eight, nine, ten. 11–12: eleven, twelve. 13–19 заканчиваются на <b>-teen</b>: thirteen, fifteen. Десятки — на <b>-ty</b>: twenty, thirty, forty, fifty. 100 — a hundred.",ex:[["twenty-five","двадцать пять"],["a hundred and twenty","сто двадцать"]]},
{h:"Который час?",p:"<b>What time is it?</b> — <b>It's five o'clock</b> (ровно пять). <b>half past six</b> — половина седьмого. <b>quarter past</b> — четверть после, <b>quarter to</b> — без четверти.",ex:[["It's half past seven.","Половина восьмого."],["It's quarter to nine.","Без четверти девять."]]}],
q:[{q:"15 = ?",o:["fifty","fifteen","five-teen"],a:1,e:"13–19 на -teen."},
{q:"40 = ?",o:["fourty","forty","fourteen"],a:1,e:"Пишется forty, без u."},
{q:"«Половина седьмого» = ?",o:["half past six","half past seven","half to six"],a:0,e:"half past six — полчаса после шести."},
{q:"What time is it? — It's three ___.",o:["hours","o'clock","time"],a:1,e:"Ровный час: o'clock."}]}]},
{t:"Времена",d:"Как говорить о настоящем и прошлом",c:"var(--sky)",ls:[
{id:"ps",t:"Present Simple",d:"Привычки и факты",s:[
{h:"Когда",p:"То, что бывает регулярно или всегда правда: привычки, расписания, факты. Слова-подсказки: <b>every day, usually, always, often, sometimes, never</b>."},
{h:"Как строится",p:"Глагол в начальной форме. Но с <b>he / she / it</b> добавляем <b>-s</b> (или -es):",tb:[["I / you / we / they","work","I work here."],["he / she / it","works","She works here."]],ex:[["She walks to school every day.","Она каждый день ходит в школу пешком."],["The sun rises in the east.","Солнце встаёт на востоке."]]},
{h:"Особые формы",p:"go → <b>goes</b>, do → <b>does</b>, have → <b>has</b>, watch → watches, study → studies."}],
q:[{q:"He ___ English every day.",o:["learn","learns","learning"],a:1,e:"he → глагол + s."},
{q:"They ___ in London.",o:["live","lives","living"],a:0,e:"they → без -s."},
{q:"She ___ two brothers.",o:["have","haves","has"],a:2,e:"have с she → has."},
{q:"My dad ___ to work by bus.",o:["go","goes","gos"],a:1,e:"go → goes."}]},
{id:"do",t:"Вопросы и отрицания: do / does",d:"Do you like…? I don't…",s:[
{h:"Вопрос",p:"Ставим <b>Do</b> (или <b>Does</b> для he/she/it) в начало. Основной глагол — без -s!",ex:[["Do you like tea?","Ты любишь чай?"],["Does she play the guitar?","Она играет на гитаре?"]]},
{h:"Отрицание",p:"<b>don't</b> (do not) и <b>doesn't</b> (does not) перед глаголом. Снова без -s: she <b>doesn't</b> play (а не plays).",ex:[["I don't understand.","Я не понимаю."],["He doesn't eat meat.","Он не ест мясо."]]},
{h:"Краткие ответы",p:"Yes, I do. / No, I don't. Yes, she does. / No, she doesn't."}],
q:[{q:"___ you speak English?",o:["Does","Do","Are"],a:1,e:"you → Do."},
{q:"She doesn't ___ coffee.",o:["drinks","drink","drinking"],a:1,e:"После doesn't глагол без -s."},
{q:"___ he live here?",o:["Do","Does","Is"],a:1,e:"he → Does."},
{q:"I ___ like cold weather.",o:["doesn't","don't","not"],a:1,e:"I → don't."}]},
{id:"pc",t:"Present Continuous",d:"То, что происходит прямо сейчас",s:[
{h:"Когда",p:"Действие идёт в этот момент: <b>now, right now, at the moment, Look!</b>"},
{h:"Как строится",p:"<b>am / is / are + глагол-ing</b>.",ex:[["I am reading a book.","Я читаю книгу (сейчас)."],["Somebody is playing the guitar.","Кто-то играет на гитаре."],["They are sleeping.","Они спят."]]},
{h:"Правила -ing",p:"make → mak<b>ing</b> (e убираем), run → ru<b>nn</b>ing (короткий слог — удваиваем), lie → l<b>ying</b>."}],
q:[{q:"Look! It ___ .",o:["rains","is raining","rain"],a:1,e:"Прямо сейчас → is + ing."},
{q:"We ___ dinner now.",o:["are having","have","has"],a:0,e:"now → are having."},
{q:"run + ing = ?",o:["runing","running","runeing"],a:1,e:"Короткий слог — удваиваем n."},
{q:"She ___ TV at the moment.",o:["watches","is watching","watch"],a:1,e:"at the moment → Continuous."}]},
{id:"past",t:"Past Simple",d:"Что было вчера и раньше",s:[
{h:"Правильные глаголы",p:"Добавляем <b>-ed</b>: work → worked, play → played, stop → stopped, study → studied. Форма одна для всех лиц.",ex:[["She worked yesterday.","Она работала вчера."],["The lion laughed.","Лев засмеялся."]]},
{h:"Неправильные глаголы",p:"У многих частых глаголов своя форма: go → <b>went</b>, see → <b>saw</b>, have → <b>had</b>, be → <b>was / were</b>. Список — в следующем уроке."},
{h:"Вопрос и отрицание",p:"С помощью <b>did / didn't</b>, а глагол — в начальной форме: <b>Did</b> you see it? I <b>didn't</b> go. Подсказки: <b>yesterday, last week, ago, in 2020</b>."}],
q:[{q:"Yesterday I ___ football.",o:["play","played","playing"],a:1,e:"yesterday → прошедшее: played."},
{q:"Did you ___ the film?",o:["saw","see","seen"],a:1,e:"После did — начальная форма."},
{q:"She ___ go to school last week.",o:["didn't","doesn't","don't"],a:0,e:"Прошлое → didn't."},
{q:"go → прошедшее?",o:["goed","went","gone"],a:1,e:"Неправильный глагол: went."}]},
{id:"irr",t:"Неправильные глаголы",d:"20 самых нужных",s:[
{h:"Три формы",p:"Первая — начальная, вторая — прошедшее время (Past Simple), третья — причастие (понадобится позже, в have done).",tb:[["be","was / were","been"],["have","had","had"],["do","did","done"],["go","went","gone"],["say","said","said"],["get","got","got"],["make","made","made"],["know","knew","known"],["think","thought","thought"],["take","took","taken"],["see","saw","seen"],["come","came","come"],["give","gave","given"],["find","found","found"],["tell","told","told"],["eat","ate","eaten"],["run","ran","run"],["write","wrote","written"],["buy","bought","bought"],["sleep","slept","slept"]]},
{h:"Как запоминать",p:"Учите их в предложениях. Когда в книге попадается went или saw — нажмите на слово: приложение покажет начальную форму и объяснит время."}],
q:[{q:"see → прошедшее?",o:["seed","saw","seen"],a:1,e:"see — saw — seen."},
{q:"buy → прошедшее?",o:["buyed","bought","brought"],a:1,e:"buy — bought."},
{q:"She ___ a letter yesterday.",o:["wrote","writed","written"],a:0,e:"write — wrote — written."},
{q:"think → прошедшее?",o:["thinked","thought","taught"],a:1,e:"think — thought."}]}]},
{t:"Строим фразы",d:"Предлоги, обладание, будущее, модальные",c:"var(--coral)",ls:[
{id:"there",t:"There is / There are",d:"Что где находится",s:[
{h:"Значение",p:"Говорим, что что-то <b>есть</b> в каком-то месте. Обычно переводим с конца: <b>There is a cat in the room.</b> — В комнате (есть) кошка.",tb:[["There is","+ один предмет","There is a key."],["There are","+ несколько","There are two doors."]]},
{h:"Вопрос и отрицание",p:"<b>Is there</b> a shop near here? — Yes, there is. <b>There isn't</b> any milk. <b>There aren't</b> any trees."}],
q:[{q:"___ a book on the table.",o:["There is","There are","It is"],a:0,e:"Один предмет → There is."},
{q:"There ___ many people here.",o:["is","are","am"],a:1,e:"many people → are."},
{q:"___ there a bank near here?",o:["Are","Is","Do"],a:1,e:"Вопрос: Is there…?"},
{q:"There ___ any trees on the island.",o:["isn't","aren't","don't"],a:1,e:"trees — множественное → aren't."}]},
{id:"prep",t:"Предлоги in, on, at",d:"Место и время",s:[
{h:"Время",tb:[["in","месяцы, годы, части дня","in May, in 2026, in the morning"],["on","дни и даты","on Monday, on 5 June"],["at","точное время","at 5 o'clock, at night"]]},
{h:"Место",tb:[["in","внутри","in the room, in London"],["on","на поверхности","on the table, on the fifth floor"],["at","в точке, у","at the door, at school"]],p:"Ещё полезные: <b>under</b> — под, <b>next to</b> — рядом с, <b>between</b> — между, <b>behind</b> — позади."}],
q:[{q:"I was born ___ 2001.",o:["on","in","at"],a:1,e:"Годы → in."},
{q:"See you ___ Monday!",o:["in","on","at"],a:1,e:"Дни недели → on."},
{q:"The film starts ___ 7 o'clock.",o:["at","in","on"],a:0,e:"Точное время → at."},
{q:"The key is ___ the table.",o:["on","at","in"],a:0,e:"На поверхности → on."}]},
{id:"have",t:"Have и have got",d:"У меня есть…",s:[
{h:"Обладание",p:"Русское «у меня есть» по-английски звучит как «я имею»: <b>I have a dog.</b> С he/she/it — <b>has</b>: She has a car.",ex:[["I have two sisters.","У меня две сестры."],["He has a cat called Pepper.","У него есть кот по кличке Пеппер."]]},
{h:"have got",p:"В британском английском часто говорят <b>have got</b> с тем же значением: I've got a bike. She's got blue eyes. Вопрос: <b>Have</b> you <b>got</b> a pen?"},
{h:"Вопрос с have",p:"С обычным have вопрос строится через do: <b>Do</b> you <b>have</b> a pen? — Yes, I do."}],
q:[{q:"She ___ a new phone.",o:["have","has","haves"],a:1,e:"she → has."},
{q:"___ you got a pen?",o:["Do","Have","Has"],a:1,e:"have got → Have you got…?"},
{q:"___ you have a car?",o:["Do","Have","Are"],a:0,e:"Обычный have → вопрос через Do."},
{q:"He's got = ?",o:["He is got","He has got","He was got"],a:1,e:"'s здесь — сокращение от has."}]},
{id:"fut",t:"Будущее: will и going to",d:"Планы и решения",s:[
{h:"will",p:"Решение, принятое прямо сейчас, обещание, предсказание: <b>I'll help you.</b> <b>It will rain tomorrow.</b> Отрицание — <b>won't</b>.",ex:[["Then I will teach you.","Тогда я тебя научу."],["We will see.","Посмотрим."]]},
{h:"be going to",p:"Заранее обдуманный план или то, что вот-вот случится по признакам: <b>I'm going to visit my grandmother.</b> <b>Look at the clouds! It's going to rain.</b>"}],
q:[{q:"The phone is ringing. — I ___ answer it!",o:["will","am going to","going"],a:0,e:"Решение в момент речи → will."},
{q:"I bought a ticket. I ___ fly to Rome.",o:["will","am going to","go to"],a:1,e:"Заранее обдуманный план → going to."},
{q:"will not = ?",o:["willn't","won't","wont not"],a:1,e:"Сокращение: won't."},
{q:"Look at the sky! It ___ rain.",o:["is going to","will to","goes"],a:0,e:"Видим признаки → going to."}]},
{id:"modal",t:"Can, must, should",d:"Могу, должен, стоит",s:[
{h:"Значения",tb:[["can","могу, умею","I can swim."],["can't","не могу","He can't read."],["must","должен (строго)","You must stop here."],["should","следует, стоит (совет)","You should rest."]]},
{h:"Главное правило",p:"После этих слов глагол идёт <b>без to и без -s</b>: She <b>can play</b> (не can plays), He <b>should go</b> (не should to go). Вопрос — модальный глагол в начало: <b>Can</b> you help me?"}],
q:[{q:"She can ___ the piano.",o:["plays","play","to play"],a:1,e:"После can — глагол без to и -s."},
{q:"You look tired. You ___ go to bed.",o:["should","can","must to"],a:0,e:"Совет → should."},
{q:"___ you help me, please?",o:["Do","Can","Must"],a:1,e:"Просьба → Can you…?"},
{q:"He ___ swim. He never learnt.",o:["can't","shouldn't","mustn't"],a:0,e:"Не умеет → can't."}]}]}
];

