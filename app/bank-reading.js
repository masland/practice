// Reading comprehension bank: 16 original passages (6 fiction, 2 poems, 8 nonfiction).
// Sentence ids are '<paragraphIndex>.<sentenceIndex>', both 0-based.
window.KS = window.KS || {}; KS.bank = KS.bank || {};
KS.bank.reading = [
  {
    id: 'r01',
    title: 'The Last Tryout',
    genre: 'fiction',
    topic: 'basketball',
    paragraphs: [
      ["Dev had practiced his jump shot every night for a month, until the porch light buzzed with moths and his mom called him inside.", "Now, on the last day of tryouts, there was one spot left on the Hawks, and everyone knew it was between him and a quiet sixth grader named Rosa."],
      ["Coach Ellis blew her whistle.", "“Final scrimmage,” she said.", "“Show me who you are.”"],
      ["With ten seconds left, the score was tied.", "Dev caught the ball at the top of the key, and the gym went quiet.", "This was the shot he had practiced a thousand times.", "But two defenders were rushing at him, arms high, and out of the corner of his eye he saw Rosa standing alone under the basket."],
      ["For one second, Dev's feet felt glued to the floor.", "If he passed, Rosa would get the glory.", "If he shot, he might miss, but at least everyone would see him try."],
      ["He passed.", "Rosa caught the ball and laid it in just as the buzzer sounded."],
      ["Afterward, Dev sat on the bench, untying his shoes slowly.", "He was sure he had just handed Rosa his spot.", "Then Coach Ellis sat down beside him with her clipboard."],
      ["“Anybody can take a shot,” she said.", "“It takes a real teammate to see the open player when the whole gym is watching you.”", "She tapped the list.", "His name was on it, and so was Rosa's, written in at the bottom in fresh ink."]
    ],
    questions: [
      { type: 'mc', skill: 'theme', q: "Which theme does the story best develop?", choices: ["Practicing every night guarantees that you will succeed.", "Being a good teammate can matter more than being the star.", "Coaches always choose the players who score the most.", "It is better to avoid taking risks in big moments."], answer: 1, explain: "Coach Ellis picks Dev because he saw the open player instead of taking the shot himself. The story shows that teamwork mattered more than glory." },
      { type: 'mc', skill: 'character', q: "Why does Dev hesitate before he passes the ball?", choices: ["He does not know how to make a pass under pressure.", "He thinks Rosa will miss the easy shot.", "He is worried that passing will give Rosa the credit and cost him the spot.", "He is waiting for the defenders to back away from him."], answer: 2, explain: "The story says, “If he passed, Rosa would get the glory.” Dev is afraid that helping Rosa will hurt his own chances." },
      { type: 'mc', skill: 'figurative language', q: "Read this sentence: “For one second, Dev's feet felt glued to the floor.” What does “glued to the floor” show?", choices: ["Dev was frozen by a hard decision.", "Dev's shoes were sticky from the gym floor.", "Dev was too tired to move after the long scrimmage.", "Dev was standing still to trick the defenders."], answer: 0, explain: "Dev's feet were not really glued. The phrase shows he was stuck for a moment, trying to decide whether to shoot or pass." },
      { type: 'mc', skill: 'inference', q: "What can the reader infer from the last sentence of the story?", choices: ["Rosa took Dev's place on the team.", "Dev's name was added only because he looked upset.", "The coach wrote the list before the scrimmage started.", "Coach Ellis made room on the team for both players."], answer: 3, explain: "Rosa's name was “written in at the bottom in fresh ink,” so the coach just added it. Both Dev and Rosa made the team." },
      { type: 'evidence', skill: 'evidence', q: "Tap the sentence that best shows why Coach Ellis chose Dev.", answer: ['6.1'], explain: "The coach says it “takes a real teammate to see the open player,” which explains what she valued in Dev." }
    ]
  },
  {
    id: 'r02',
    title: 'Eight Counts',
    genre: 'fiction',
    topic: 'dance',
    paragraphs: [
      ["Backstage at the regional dance competition, the air smelled like hairspray and nervous sweat.", "Priya pressed her hand against her stomach, where butterflies were doing their own routine."],
      ["Two weeks ago, she had tried the triple turn at rehearsal and crashed to the floor in front of the whole crew.", "Someone had laughed, and even though they said sorry, the sound had followed her home like a stray cat."],
      ["Ms. Reyes knelt beside her.", "“You can do the double turn tonight,” she said gently.", "“It's still beautiful, and nobody will know the difference.”"],
      ["Priya would know.", "She had spent every recess in the empty music room, spinning until the walls blurred, landing it nine times out of ten.", "Nine out of ten was not ten, though, and the stage lights were a lot brighter than the music room."],
      ["“I'm doing the triple,” she said, surprised by how steady her voice sounded."],
      ["The music thumped, and the crew exploded onto the stage.", "Eight counts, then eight more.", "When her moment came, Priya planted her foot and spun: one, two, three.", "She wobbled on the landing, and her arm swung out wider than it should have, but she didn't fall.", "She hit the next count right on the beat."],
      ["The Night Owls took third place, not first.", "Still, as they piled into the van, Priya couldn't stop smiling.", "The trophy was small, but the girl holding it felt taller than she had in weeks."]
    ],
    questions: [
      { type: 'mc', skill: 'theme', q: "Which statement best expresses the theme of the story?", choices: ["Winning first place is the only way to feel proud.", "It is wise to choose the easier path when you feel nervous.", "Real courage means trying something hard even after you have failed at it.", "Friends should never laugh at each other's mistakes."], answer: 2, explain: "Priya fell before, but she still chose the triple turn and felt proud afterward. The story is about being brave enough to try again." },
      { type: 'mc', skill: 'figurative language', q: "The laugh “had followed her home like a stray cat.” What does this simile suggest?", choices: ["Priya kept thinking about the embarrassing moment long after it happened.", "A cat really followed Priya home from rehearsal.", "Priya was angry at the person who laughed.", "Priya felt lonely walking home by herself."], answer: 0, explain: "A stray cat keeps following you even when you want it to leave. The memory of the laugh stayed with Priya the same way." },
      { type: 'mc', skill: "author's purpose", q: "Why does the author include the short sentence “Priya would know.”?", choices: ["To show that Priya does not trust Ms. Reyes.", "To hint that Priya will tell the judges about the change.", "To show that Priya has already decided to quit.", "To show that Priya cares about doing her best, not just about what the audience sees."], answer: 3, explain: "Ms. Reyes says nobody will know the difference. Priya's answer shows that she would know, and that matters to her." },
      { type: 'mc', skill: 'vocabulary', q: "Read this sentence: “‘I'm doing the triple,’ she said, surprised by how steady her voice sounded.” What does “steady” mean here?", choices: ["loud and angry", "calm and firm, not shaky", "quiet and hard to hear", "fast and rushed"], answer: 1, explain: "Priya is surprised because she was nervous, yet her voice did not shake. “Steady” means calm and firm." },
      { type: 'evidence', skill: 'evidence', q: "Tap the sentence that best shows how hard Priya worked to master the triple turn.", answer: ['3.1'], explain: "She practiced “every recess in the empty music room,” spinning until the walls blurred. That shows a lot of hard work." }
    ]
  },
  {
    id: 'r03',
    title: 'Final Cut',
    genre: 'fiction',
    topic: 'video contest',
    paragraphs: [
      ["Leo had watched the clip forty-seven times.", "A gray heron stood in the creek behind their apartment, perfectly still, and then, just as the sun broke over the trees, it unfolded its wings and lifted into the gold light."],
      ["It was the best shot in his whole video.", "It was also the one shot he hadn't filmed."],
      ["His little sister, Nora, had grabbed his phone that morning because she wanted to “make a movie like Leo.”", "She'd been aiming at a squirrel when the heron took off.", "Now she was asleep down the hall, with no idea her accident was the heart of his contest entry."],
      ["The deadline for the county's “Our Town in 60 Seconds” contest was midnight.", "The grand prize was a real camera, the kind with lenses you could swap.", "Leo's cursor blinked in the box that said Filmed and edited by."],
      ["He typed his own name.", "Nobody would ever know.", "Nora couldn't even spell heron."],
      ["But when he played the video one last time, he noticed something he'd missed.", "At the very end of the heron shot, the camera wobbled, and he could hear a tiny voice whisper, “Whoa.”"],
      ["Leo sighed, opened the credits, and added one more line in bold letters: Heron footage by Nora Alvarez, age 8.", "Then he hit Submit before he could change his mind."],
      ["In the morning, Nora read the credits three times, then ran around the kitchen shouting that she was a famous director.", "Leo didn't know yet whether he'd win the camera.", "Somehow, watching her, it didn't seem like the most important prize anymore."]
    ],
    questions: [
      { type: 'mc', skill: 'theme', q: "Which theme is best supported by the story?", choices: ["Hard work always leads to winning a prize.", "Giving others honest credit can be more rewarding than winning.", "Younger siblings often get in the way of big projects.", "Lucky accidents usually ruin creative projects."], answer: 1, explain: "Leo gives Nora credit even though it might cost him. Seeing her joy matters more to him than the camera." },
      { type: 'mc', skill: 'inference', q: "What does the sentence “Nora couldn't even spell heron” show about Leo's thinking at that moment?", choices: ["He is making excuses for leaving Nora's name off.", "He is proud of how much Nora has learned.", "He thinks Nora should practice her spelling.", "He believes Nora filmed the heron on purpose."], answer: 0, explain: "Leo has just typed only his own name. He tells himself Nora is too young to matter, which is an excuse for not giving her credit." },
      { type: 'mc', skill: 'text structure', q: "Which event is the turning point that changes Leo's decision?", choices: ["He reads that the grand prize is a real camera.", "He types his own name in the form.", "Nora reads the credits the next morning.", "He hears Nora's tiny whisper at the end of the heron clip."], answer: 3, explain: "Right after he hears Nora whisper “Whoa,” Leo opens the credits and adds her name. Hearing her voice reminds him whose shot it really was." },
      { type: 'mc', skill: 'vocabulary', q: "Read this sentence: “Now she was asleep down the hall, with no idea her accident was the heart of his contest entry.” What does “the heart” mean here?", choices: ["the saddest part", "the first part", "the most important part", "a symbol of love"], answer: 2, explain: "The heron shot is “the best shot in his whole video.” Here “the heart” means the most important part." },
      { type: 'evidence', skill: 'evidence', q: "Tap the sentence that best shows that Leo chose to be honest.", answer: ['6.0'], explain: "Leo adds the line “Heron footage by Nora Alvarez, age 8,” giving his sister credit for her shot." }
    ]
  },
  {
    id: 'r04',
    title: 'The Scoop',
    genre: 'fiction',
    topic: 'robotics',
    paragraphs: [
      ["The claw opened, closed, and dropped the foam cube for the third time in a row.", "In the stands, someone groaned.", "Ava stared at the scoreboard as the first round ended: Circuit Breakers, 4 points.", "Last place."],
      ["She had designed that claw herself.", "She had drawn it on graph paper, built it at her kitchen table, and defended it at every team meeting."],
      ["Three weeks ago, Sam had raised his hand.", "“What if we used a scoop instead?” he'd asked softly.", "“With rubber bands, so the cubes can't bounce out.”", "Ava had barely looked up.", "“Claws are what real robots use,” she'd said, and the meeting moved on."],
      ["Now there were twenty minutes until the final round.", "The team huddled in the pit area, nobody talking.", "Sam was quietly sketching in his notebook, the way he always did."],
      ["Ava felt her face grow hot.", "Asking Sam for help meant admitting, in front of everyone, that she had been wrong for three weeks.", "Keeping the claw meant losing again."],
      ["She took a breath and sat down next to him.", "“Sam, can you show me the scoop?”"],
      ["He blinked, then flipped his notebook around.", "The sketch was neat and careful, with every measurement labeled.", "The team built it together in eighteen minutes, passing screwdrivers back and forth like a relay team."],
      ["In the final round, the scoop slid under cube after cube.", "They didn't win the tournament, but they climbed to fifth place.", "On the bus ride home, Ava asked Sam to sit up front with her and start planning next season's robot."]
    ],
    questions: [
      { type: 'mc', skill: 'theme', q: "Which theme does the story best develop?", choices: ["Winning a tournament is the best reward for teamwork.", "Quiet people always have the best ideas.", "You should defend your own ideas no matter what.", "A good leader is willing to listen and admit mistakes."], answer: 3, explain: "Ava's team only improves after she admits she was wrong and asks Sam for his idea. The story shows that listening makes a better leader." },
      { type: 'mc', skill: 'character', q: "How does Ava change from the beginning of the story to the end?", choices: ["She goes from ignoring Sam's ideas to treating him as a partner.", "She goes from shy and quiet to loud and bossy.", "She goes from loving robotics to wanting to quit.", "She goes from trusting her team to doing everything herself."], answer: 0, explain: "At first Ava “barely looked up” when Sam spoke. By the end she asks him to help plan next season's robot." },
      { type: 'mc', skill: 'inference', q: "Why does Ava's face grow hot?", choices: ["She is angry that Sam didn't speak up sooner.", "She is embarrassed that she will have to admit she was wrong.", "She is overheated from building the robot.", "She is excited because she knows the scoop will win."], answer: 1, explain: "The next sentence explains that asking Sam meant admitting “in front of everyone” that she had been wrong. That is embarrassing." },
      { type: 'mc', skill: 'figurative language', q: "The team passed screwdrivers “back and forth like a relay team.” What does this simile show?", choices: ["The team was racing other teams to the pit area.", "The team was arguing over who got to use the tools.", "The team was working quickly and smoothly together.", "The team was tired from running around the arena."], answer: 2, explain: "Relay runners pass a baton fast and in rhythm. The simile shows the team working together quickly to finish in eighteen minutes." },
      { type: 'evidence', skill: 'evidence', q: "Tap the sentence that best shows that Ava brushed off Sam's idea at first.", answer: ['2.3', '2.4'], explain: "Ava “barely looked up” and said claws are what real robots use. She did not take Sam's idea seriously." }
    ]
  },
  {
    id: 'r05',
    title: 'Ink on Her Wrist',
    genre: 'fiction',
    topic: 'friendship',
    paragraphs: [
      ["Zoe noticed the ink during the science test.", "Imani kept tugging her sleeve down, but when she reached for her eraser, Zoe saw tiny blue letters on her wrist: the steps of the water cycle, in order."],
      ["On Friday, Ms. Okafor handed back the tests.", "“Imani, a perfect score,” she announced.", "“That puts you on the Science Bowl team.”", "Across the room, Marco's shoulders sank.", "He had missed the team by one point, and Zoe knew he'd studied every night that week, because he'd quizzed her at the bus stop."],
      ["At lunch, Imani was glowing.", "“Can you believe it?” she said, ripping open her chips.", "Zoe could believe it.", "That was the problem."],
      ["She thought about staying quiet.", "Imani had been her best friend since kindergarten, since the day they'd both cried about the same lost mitten.", "Telling Ms. Okafor would feel like breaking something that couldn't be glued back together.", "But saying nothing felt like stealing from Marco."],
      ["After school, Zoe caught up with Imani by the bike rack.", "“I saw your wrist during the test,” she said.", "Her heart pounded so hard she could feel it in her ears."],
      ["Imani's face went pale, then red.", "“So you're going to tell on me?”", "“No,” Zoe said.", "“I think you should tell her yourself.”"],
      ["Imani didn't speak to her for two whole days.", "On the third morning, though, Zoe saw her walk into Ms. Okafor's room before the bell, alone, with her sleeves pushed all the way up."]
    ],
    questions: [
      { type: 'mc', skill: 'theme', q: "Which theme is best supported by the story?", choices: ["Cheating always gets caught right away.", "It is best to stay out of other people's problems.", "A true friend tells you a hard truth, even when it is uncomfortable.", "Winning a spot on a team is worth any risk."], answer: 2, explain: "Zoe risks her friendship to tell Imani the truth, and Imani finally does the right thing. Real friendship includes hard honesty." },
      { type: 'mc', skill: 'inference', q: "Read these sentences: “Zoe could believe it. That was the problem.” What does Zoe mean?", choices: ["She knows how Imani really got the perfect score.", "She is jealous that Imani is smarter than she is.", "She thinks Ms. Okafor graded the test wrong.", "She is worried that Imani will brag too much."], answer: 0, explain: "Zoe saw the answers written on Imani's wrist. She can believe the perfect score because she knows Imani cheated." },
      { type: 'mc', skill: 'inference', q: "Why does saying nothing feel “like stealing from Marco” to Zoe?", choices: ["Marco had lent Imani his notes before the test.", "Marco asked Zoe to report Imani to the teacher.", "Marco would stop being friends with Zoe.", "Marco earned the team spot, but Imani took it by cheating."], answer: 3, explain: "Marco studied every night and missed the team by one point. If Zoe stays quiet, Imani keeps a spot that Marco honestly earned." },
      { type: 'mc', skill: 'inference', q: "What does the last sentence suggest about Imani?", choices: ["She wants to show the teacher that the ink washed off.", "She has decided to stop hiding and tell the truth.", "She is going to ask for a harder test.", "She is still angry and wants to complain about Zoe."], answer: 1, explain: "Imani used to tug her sleeve down to hide the ink. Pushing her sleeves up and going to the teacher alone shows she is done hiding." },
      { type: 'evidence', skill: 'evidence', q: "Tap the sentence that best shows Zoe wants Imani to make things right on her own.", answer: ['5.3'], explain: "Zoe says, “I think you should tell her yourself.” She wants Imani to be the one who confesses." }
    ]
  },
  {
    id: 'r06',
    title: 'The Open Gate',
    genre: 'fiction',
    topic: 'lost dog',
    paragraphs: [
      ["The rain started just as Nate's mom yelled from the backyard.", "“Biscuit's gone!”"],
      ["Nate pulled off his headphones.", "His friends were waiting for him online, and the tournament started in five minutes.", "He walked to the window and saw the gate swinging in the wind, its latch hanging loose."],
      ["His stomach dropped.", "An hour ago, he had carried out the trash, and he had been in such a hurry to get back to his game that he hadn't looked back."],
      ["Downstairs, his little brother Theo was sobbing into the couch cushions.", "“Theo,” Mom said, “did you leave the gate open again?”", "Theo shook his head so hard his hair flopped, but he'd left it open twice last month, and Nate could see Mom didn't believe him."],
      ["Nate's headset buzzed on the stairs.", "Nobody had seen him go outside.", "He could say nothing, go back upstairs, and be in the tournament in time."],
      ["Instead, he took a deep breath.", "“It wasn't Theo,” he said.", "“I left the gate open when I took out the trash.”"],
      ["Mom looked at him for a long moment, then handed him a flashlight.", "“Then let's go find her.”"],
      ["Nate and Theo searched the whole block in the pouring rain, calling Biscuit's name until their voices cracked.", "Finally, Theo spotted two shining eyes under Mrs. Kim's porch.", "Biscuit crawled out, muddy and shivering, and licked Theo's face."],
      ["That night, Nate fixed the latch with a new spring from the garage.", "Theo watched the whole time, holding Biscuit in a towel.", "“You're the best brother,” he said, even though Nate knew he hadn't been, not that afternoon."]
    ],
    questions: [
      { type: 'mc', skill: 'theme', q: "Which theme does the story best develop?", choices: ["Owning up to a mistake is right, even when no one would find out.", "Pets should always be kept inside during storms.", "Video games make people forget everything else.", "Younger brothers usually get blamed unfairly."], answer: 0, explain: "Nobody saw Nate leave the gate open, but he admits it anyway and helps fix the problem. The story is about taking responsibility." },
      { type: 'mc', skill: 'character', q: "Why does Nate hesitate before he speaks up?", choices: ["He thinks Theo really did leave the gate open.", "He is afraid to go out in the storm.", "If he stays quiet, he can avoid trouble and still play in the tournament.", "He does not care whether Biscuit comes home."], answer: 2, explain: "The story says nobody saw him go outside and he could “be in the tournament in time.” Staying quiet would be easier for him." },
      { type: 'mc', skill: "author's purpose", q: "Why does the author mention that Theo had left the gate open twice last month?", choices: ["To show that Theo deserves the blame this time.", "To explain why Mom suspects Theo instead of Nate.", "To show that Biscuit runs away all the time.", "To prove that Nate is more careful than Theo."], answer: 1, explain: "Because Theo had done it before, Mom assumes he did it again. That makes Nate's choice harder, since Theo could easily be blamed." },
      { type: 'mc', skill: 'figurative language', q: "When Nate sees the gate, “His stomach dropped.” What does this phrase show?", choices: ["Nate was hungry after playing for so long.", "Nate tripped on the stairs.", "Nate felt relieved that Biscuit was outside.", "Nate suddenly felt sick with worry and guilt."], answer: 3, explain: "His stomach did not really fall. The phrase shows the sinking feeling he gets when he realizes the open gate is his fault." },
      { type: 'evidence', skill: 'evidence', q: "Tap the sentence that shows how Nate realized the open gate was his fault.", answer: ['2.1'], explain: "Nate remembers that he took out the trash and was in such a hurry that he “hadn't looked back.”" }
    ]
  },
  {
    id: 'r07',
    title: 'Storm Day',
    genre: 'poem',
    topic: 'storms',
    paragraphs: [
      ["The afternoon sky pulls on a dark gray coat", "and frowns at the town below.", "The maple trees start whispering,", "leaning close so the grass won't know."],
      ["Then thunder clears its giant throat,", "a drummer counting four,", "and lightning snaps a silver photo", "of the swing set and the door."],
      ["The rain arrives, a thousand dancers", "tap-tapping on the roof,", "while the gutters gulp and gargle", "like they can't get enough."],
      ["By dinner, the storm is tired.", "It yawns and rolls away,", "and puddles hold bits of sunset", "like coins it dropped along the way."]
    ],
    questions: [
      { type: 'mc', skill: 'figurative language', q: "The line “Then thunder clears its giant throat” is an example of which kind of figurative language?", choices: ["simile", "personification", "onomatopoeia", "alliteration"], answer: 1, explain: "Thunder cannot really clear its throat. Giving it a human action is personification." },
      { type: 'mc', skill: 'figurative language', q: "In the third stanza, the poet calls the rain “a thousand dancers.” What does this help the reader picture?", choices: ["Many raindrops hitting the roof in a quick rhythm.", "People dancing outside in the storm.", "Rain falling quietly and slowly.", "A crowd of people hiding from the storm."], answer: 0, explain: "The dancers are “tap-tapping on the roof.” The metaphor helps you hear lots of raindrops tapping fast, like dancers' feet." },
      { type: 'mc', skill: 'text structure', q: "How is the poem organized?", choices: ["It compares two different storms.", "It explains the causes and effects of lightning.", "It is told from the point of view of a raindrop.", "It follows a storm from when it arrives to when it leaves."], answer: 3, explain: "The first stanza shows the storm coming, the middle stanzas show it at its strongest, and the last stanza shows it rolling away." },
      { type: 'mc', skill: 'inference', q: "Which words best describe how the storm is shown in the last stanza?", choices: ["angry and dangerous", "excited and wild", "worn out and calm", "sad and lonely"], answer: 2, explain: "The storm is “tired” and “yawns and rolls away.” Those are words for someone worn out and calming down." },
      { type: 'evidence', skill: 'evidence', q: "Tap the line that best shows the storm is ending.", answer: ['3.0', '3.1'], explain: "“By dinner, the storm is tired” and “It yawns and rolls away” both show the storm finishing." }
    ]
  },
  {
    id: 'r08',
    title: 'The Library After Closing',
    genre: 'poem',
    topic: 'books',
    paragraphs: [
      ["When the last kid leaves and the lights click off,", "the library lets out a sigh.", "The shelves stretch their long wooden arms,", "and the clock blinks one sleepy eye."],
      ["The dictionaries mutter words", "they've held in all day long,", "and the poetry books on the second floor", "hum a half-remembered song."],
      ["Each book is a door that is waiting,", "each page is a stair to climb,", "and the stories inside are restless as puppies", "who've been told to sit one more time."],
      ["So they whisper and rustle and wait in the dark,", "as patient as stars in the sky,", "for morning, and footsteps, and someone like you", "to pull one down and give it a try."]
    ],
    questions: [
      { type: 'mc', skill: 'figurative language', q: "The line “each page is a stair to climb” is an example of which kind of figurative language?", choices: ["simile", "personification", "metaphor", "onomatopoeia"], answer: 2, explain: "The poet says a page IS a stair, without using “like” or “as.” A direct comparison like that is a metaphor." },
      { type: 'mc', skill: 'figurative language', q: "The stories are “restless as puppies / who've been told to sit one more time.” What does this simile suggest?", choices: ["The stories are all about dogs and other pets.", "The stories are tired and want to sleep.", "The stories are eager to be read and hard to keep still.", "The stories are badly behaved and should be put away."], answer: 2, explain: "Puppies told to sit can barely hold still because they want to jump up. The stories feel the same way about being read." },
      { type: 'mc', skill: 'central idea', q: "What is the central message of the poem?", choices: ["Libraries are spooky places at night.", "Books are full of life and are waiting for readers to open them.", "People should return library books on time.", "Reading is best done alone in the dark."], answer: 1, explain: "The whole poem shows books waking up, whispering, and waiting “for morning” and “someone like you” to read them." },
      { type: 'mc', skill: 'figurative language', q: "Which line from the poem uses personification?", choices: ["When the last kid leaves and the lights click off,", "each page is a stair to climb,", "for morning, and footsteps, and someone like you", "The shelves stretch their long wooden arms,"], answer: 3, explain: "Shelves cannot really stretch their arms. Giving them a human action is personification." },
      { type: 'evidence', skill: 'evidence', q: "Tap the line that best proves the poem takes place after the library has closed.", answer: ['0.0'], explain: "The first line says the last kid has left and the lights have clicked off, so the library is closed." }
    ]
  },
  {
    id: 'r09',
    title: 'Where Weather Collides',
    genre: 'nonfiction',
    topic: 'weather fronts',
    paragraphs: [
      ["Have you ever noticed that a stormy afternoon can be followed by a cool, clear evening?", "Often, the reason is a front."],
      ["Air near Earth's surface gathers into huge bodies called air masses.", "An air mass can stretch across hundreds of miles, and it takes on the temperature and moisture of the place where it formed.", "Air that forms over the Gulf of Mexico, for example, tends to be warm and humid, while air that forms over northern Canada is cold and dry.", "A front is the boundary where two different air masses meet."],
      ["When a cold air mass pushes into warmer air, it forms a cold front.", "Cold air is denser, or heavier, than warm air, so it slides underneath the warm air like a snowplow and shoves it upward quickly.", "As the warm, moist air rises, it cools, and its water vapor condenses into tall, puffy clouds.", "That is why cold fronts often bring thunderstorms, heavy rain, and gusty winds.", "The storms usually do not last long, and once the front passes, the air turns cooler and drier."],
      ["A warm front works more gently.", "Warm air moves in and slowly rides up over the cooler air that is already there, like someone walking up a long ramp.", "Because the warm air rises gradually, it forms wide, flat layers of clouds.", "Warm fronts often bring hours of steady rain or drizzle, followed by warmer, more humid weather."],
      ["On weather maps, a cold front is drawn as a blue line with triangles, and a warm front is a red line with half circles.", "Spotting these lines can help you predict tomorrow's weather."]
    ],
    questions: [
      { type: 'mc', skill: 'central idea', q: "What is the central idea of the passage?", choices: ["Cold fronts are dangerous and should always be avoided.", "Fronts form where air masses meet, and cold and warm fronts bring different weather.", "Weather maps use colors and shapes to show temperature.", "Air masses always form over oceans."], answer: 1, explain: "Most of the passage explains what a front is and how cold fronts and warm fronts change the weather in different ways." },
      { type: 'mc', skill: 'text structure', q: "How does the author organize the third and fourth paragraphs?", choices: ["By comparing and contrasting two kinds of fronts.", "By telling events in the order they happened.", "By describing a problem and then its solution.", "By listing the steps for drawing a weather map."], answer: 0, explain: "The third paragraph describes cold fronts and the fourth describes warm fronts, showing how they are alike and different." },
      { type: 'mc', skill: 'vocabulary', q: "Read this sentence: “Because the warm air rises gradually, it forms wide, flat layers of clouds.” What does “gradually” mean?", choices: ["suddenly and with force", "in a spinning circle", "high into space", "slowly, a little at a time"], answer: 3, explain: "The author says a warm front “works more gently” and the air rides up “slowly,” like walking up a long ramp. “Gradually” means a little at a time." },
      { type: 'mc', skill: 'inference', q: "A town has a warm, sunny morning. In the afternoon a sudden thunderstorm rolls in, and by evening the air is chilly and dry. What most likely passed through the town?", choices: ["a warm front", "a hurricane", "a cold front", "a warm air mass from the Gulf of Mexico"], answer: 2, explain: "The passage says cold fronts bring short thunderstorms, and afterward “the air turns cooler and drier.” That matches the town's day." },
      { type: 'evidence', skill: 'evidence', q: "Tap the sentence that best explains why cold fronts often cause thunderstorms.", answer: ['2.1', '2.2'], explain: "Cold air shoves warm air “upward quickly,” and as that moist air rises it forms tall storm clouds." }
    ]
  },
  {
    id: 'r10',
    title: 'The Ocean-Powered Storm',
    genre: 'nonfiction',
    topic: 'hurricanes',
    paragraphs: [
      ["A hurricane can be hundreds of miles wide, with winds strong enough to rip roofs off houses.", "Yet every hurricane begins with something that seems harmless: warm ocean water."],
      ["Hurricanes form over tropical oceans, usually where the surface water is at least about 80 degrees Fahrenheit.", "The warm water heats the air above it, and lots of water evaporates, filling the air with moisture.", "This warm, moist air rises.", "As it climbs higher, it cools, and the water vapor condenses into towering clouds."],
      ["Here is the secret to a hurricane's strength.", "When water vapor condenses, it releases heat.", "That heat warms the surrounding air, which makes it rise even faster.", "As air rushes upward, it leaves behind an area of low pressure near the ocean surface, and more warm, moist air flows in to take its place.", "The cycle repeats again and again, like an engine burning fuel, and the fuel is warm ocean water."],
      ["Earth's rotation causes the rushing winds to curve, so the storm begins to spin.", "In the Northern Hemisphere, hurricanes spin counterclockwise.", "When the storm's steady winds reach 74 miles per hour, it is officially called a hurricane.", "At its center is the eye, a surprisingly calm area that may even have blue sky."],
      ["Because warm water powers a hurricane, the storm usually weakens once it moves over land or cooler water.", "Cut off from its fuel, it slowly runs out of energy.", "Still, before that happens, a hurricane can bring dangerous winds, flooding rain, and a rise of seawater called storm surge, so forecasters track every storm carefully."]
    ],
    questions: [
      { type: 'mc', skill: 'central idea', q: "Which sentence best states the central idea of the passage?", choices: ["Hurricanes are the most dangerous storms on Earth.", "The eye is the calmest part of a hurricane.", "Hurricanes spin counterclockwise in the Northern Hemisphere.", "Hurricanes get their energy from warm ocean water and weaken without it."], answer: 3, explain: "The passage keeps returning to warm water: it starts the storm, fuels it, and the storm weakens when it is cut off from it. The other choices are small details." },
      { type: 'mc', skill: 'figurative language', q: "The author compares a hurricane to “an engine burning fuel.” In this comparison, what is the fuel?", choices: ["Earth's rotation", "warm ocean water", "the calm eye of the storm", "cool air over land"], answer: 1, explain: "The sentence says it directly: “the fuel is warm ocean water.”" },
      { type: 'mc', skill: 'inference', q: "A hurricane moves off the warm ocean and onto land in Virginia. Based on the passage, what will most likely happen next?", choices: ["It will slowly weaken because it has lost its source of energy.", "It will grow stronger because land is warmer than water.", "It will stop spinning right away.", "It will form a second eye over the land."], answer: 0, explain: "The passage says a hurricane “usually weakens once it moves over land” because it is cut off from its fuel." },
      { type: 'mc', skill: 'text structure', q: "How is the information organized in the paragraph that begins “Here is the secret”?", choices: ["By comparing hurricanes with thunderstorms.", "By describing a problem and its solution.", "By explaining causes and effects, where each step leads to the next.", "By listing unrelated facts about storms."], answer: 2, explain: "Each sentence causes the next: condensing vapor releases heat, the heat makes air rise faster, and rising air pulls in more warm air." },
      { type: 'evidence', skill: 'evidence', q: "Tap the sentence that best explains how condensation makes a hurricane stronger.", answer: ['2.1', '2.2'], explain: "Condensing water vapor “releases heat,” and that heat makes the air “rise even faster,” which feeds the storm." }
    ]
  },
  {
    id: 'r11',
    title: 'The King Who Carried Gold',
    genre: 'nonfiction',
    topic: 'Mali Empire',
    paragraphs: [
      ["In 1324, a caravan crossed the Sahara Desert that people would talk about for centuries.", "Thousands of travelers and camels moved together, and many of the camels carried gold.", "At the head of the caravan was Mansa Musa, the ruler of the Mali Empire in West Africa."],
      ["Mali grew rich because of trade.", "The empire controlled important gold fields, and gold was in high demand in North Africa, Europe, and the Middle East.", "But the people of West Africa needed something just as badly: salt.", "Salt kept food from spoiling and helped people stay healthy in the hot climate, yet there was little of it in the region.", "Traders brought huge blocks of salt from mines in the Sahara on camels, and in Mali's markets they traded it for gold.", "Because Mali controlled this gold-salt trade and taxed the goods passing through, its rulers grew very wealthy."],
      ["Mansa Musa was a Muslim, and in 1324 he made the hajj, the pilgrimage to the holy city of Mecca.", "Along the way, he stopped in Cairo, Egypt, where he spent and gave away enormous amounts of gold.", "Writers at the time reported that he handed out so much that the value of gold in Cairo dropped for years afterward."],
      ["The journey did more than show off his riches.", "Mansa Musa returned home with scholars and builders, and he had grand mosques built, including one in the city of Timbuktu.", "Over time, Timbuktu became famous as a center of trade and learning, where students studied books on religion, law, math, and astronomy.", "His trip put Mali on the map, sometimes literally: a European map made in 1375 shows him holding a gold nugget."]
    ],
    questions: [
      { type: 'mc', skill: 'central idea', q: "What is the central idea of the passage?", choices: ["Salt was worth more than gold everywhere in the world.", "Mansa Musa traveled to Cairo to conquer new land.", "Mali grew wealthy through the gold-salt trade, and Mansa Musa's journey made Mali famous.", "Timbuktu was the only important city in the Mali Empire."], answer: 2, explain: "The passage explains how trade made Mali rich and how Mansa Musa's 1324 trip spread Mali's fame. The other choices misread the details." },
      { type: 'mc', skill: 'inference', q: "Why would traders carry heavy blocks of salt all the way across the Sahara?", choices: ["They could trade it for gold, because salt was scarce and needed in West Africa.", "They needed the salt to feed their camels on the trip.", "Salt was used to build the mosques in Timbuktu.", "Mansa Musa ordered them to bring salt as a gift."], answer: 0, explain: "The passage says there was “little of it in the region” and that traders “traded it for gold.” Salt was worth the long trip." },
      { type: 'mc', skill: 'vocabulary', q: "Read this sentence: “Mansa Musa was a Muslim, and in 1324 he made the hajj, the pilgrimage to the holy city of Mecca.” What is a pilgrimage?", choices: ["a trading trip to sell gold", "a journey to a holy place for religious reasons", "a war fought to win new land", "a celebration held in a palace"], answer: 1, explain: "The sentence connects the trip to Mansa Musa's religion and calls Mecca a “holy city.” A pilgrimage is a religious journey to a holy place." },
      { type: 'mc', skill: "author's purpose", q: "Why does the author include the detail about the European map made in 1375?", choices: ["To explain how traders found their way across the desert.", "To prove that Europeans ruled Mali.", "To describe what gold nuggets look like.", "To show how far Mansa Musa's fame had spread."], answer: 3, explain: "Mapmakers in faraway Europe drew Mansa Musa holding gold. That shows people far from Mali had heard of him." },
      { type: 'evidence', skill: 'evidence', q: "Tap the sentence that best shows how much gold Mansa Musa gave away.", answer: ['2.2'], explain: "He gave away so much gold that its value in Cairo “dropped for years afterward.” That is a huge amount." }
    ]
  },
  {
    id: 'r12',
    title: 'When Two Worlds Traded',
    genre: 'nonfiction',
    topic: 'Columbian Exchange',
    paragraphs: [
      ["Imagine Italian food with no tomatoes, Irish meals with no potatoes, or a world with no chocolate.", "Before 1492, that was reality in Europe, because those foods grew only in the Americas."],
      ["When Christopher Columbus sailed across the Atlantic Ocean in 1492, he connected two halves of the world that had been almost completely cut off from each other for thousands of years.", "Soon, ships were carrying plants, animals, and people back and forth between the Eastern and Western Hemispheres.", "Historians call this huge swap the Columbian Exchange."],
      ["From the Americas, Europeans brought home corn, potatoes, tomatoes, peppers, and cacao, the bean used to make chocolate.", "Potatoes grew well in cool, rocky soil, and they became an important food in Ireland and many other parts of Europe.", "Corn spread to Africa and Asia, where it still feeds millions of people today."],
      ["Traveling the other direction, ships carried wheat, rice, sugarcane, and animals such as horses, cattle, and pigs to the Americas.", "Horses changed life for many Native American nations on the Great Plains, who used them to hunt buffalo and travel long distances."],
      ["But the exchange also carried something invisible and deadly.", "Europeans brought diseases such as smallpox and measles, which had never existed in the Americas.", "Native Americans had no immunity, or natural protection, against these germs, and millions died.", "In some communities, more than half of the people were lost."],
      ["The Columbian Exchange brought new foods and animals that changed daily life around the globe.", "It also caused terrible suffering.", "Both sides of that story are part of how our world came to be."]
    ],
    questions: [
      { type: 'mc', skill: 'central idea', q: "What is the central idea of the passage?", choices: ["The Columbian Exchange moved plants, animals, and diseases between the hemispheres, with both helpful and harmful effects.", "Columbus brought chocolate to Europe so people would enjoy it.", "Horses were the most important part of the Columbian Exchange.", "The Columbian Exchange was mostly good for Native Americans."], answer: 0, explain: "The passage describes what moved each way and ends by saying the exchange changed daily life but “also caused terrible suffering.”" },
      { type: 'mc', skill: 'text structure', q: "How does the author organize the third and fourth paragraphs?", choices: ["By explaining a problem and then its solution.", "By telling the events of Columbus's voyage in time order.", "By giving an opinion and then reasons for it.", "By describing what moved in one direction and then what moved in the other direction."], answer: 3, explain: "The third paragraph tells what came “from the Americas,” and the fourth tells what traveled “the other direction.”" },
      { type: 'mc', skill: 'vocabulary', q: "Read this sentence: “Native Americans had no immunity, or natural protection, against these germs, and millions died.” What does “immunity” mean?", choices: ["medicine made from plants", "the body's ability to fight off a disease", "a law that keeps people safe", "a way to avoid traveling"], answer: 1, explain: "The author gives a clue right after the word: “or natural protection.” Immunity is the body's natural protection against germs." },
      { type: 'mc', skill: "author's purpose", q: "Why does the author begin the passage with tomatoes, potatoes, and chocolate?", choices: ["To argue that European food was boring before 1492.", "To explain how to grow these foods.", "To hook readers by connecting the topic to foods they know.", "To show that the exchange caused no harm."], answer: 2, explain: "Starting with familiar foods makes readers curious and shows right away how the exchange still affects their lives." },
      { type: 'evidence', skill: 'evidence', q: "Tap the sentence that gives the strongest evidence that the Columbian Exchange caused great harm.", answer: ['4.2', '4.3'], explain: "These sentences give facts about the harm: millions died, and some communities lost more than half their people." }
    ]
  },
  {
    id: 'r13',
    title: 'The Hard Years at Jamestown',
    genre: 'nonfiction',
    topic: 'Jamestown',
    paragraphs: [
      ["In May 1607, three English ships sailed up a wide river in Virginia.", "About 104 men and boys stepped ashore and built a fort on a marshy piece of land they called Jamestown.", "It became the first permanent English settlement in North America, but for years it barely survived."],
      ["The first problem was the location.", "The colonists chose the spot because it would be easy to defend against Spanish ships.", "However, the land was swampy and full of mosquitoes, and in summer the river water near the fort turned salty and dirty.", "Drinking it made many settlers sick."],
      ["The second problem was the colonists themselves.", "Many were gentlemen who had never farmed or done hard physical work.", "Some spent their time searching for gold instead of planting crops or building shelters.", "They had also arrived too late in the spring to plant a strong harvest."],
      ["Nature added another challenge.", "By studying tree rings from old cypress trees, scientists learned that the region was suffering through one of its worst droughts in hundreds of years.", "Crops withered, and food ran short."],
      ["The colonists depended on trade with the Powhatan people for corn, but the relationship was tense and sometimes violent.", "By the time a supply ship arrived in January 1608, only about 38 of the first colonists were still alive.", "Things got even worse in the winter of 1609 to 1610, a period remembered as the Starving Time, when most of the colony's roughly 500 people died."],
      ["Jamestown finally began to last after colonists started growing tobacco to sell in England.", "Its survival came at a huge cost, both for the settlers and for the Powhatan people whose land they took."]
    ],
    questions: [
      { type: 'mc', skill: 'text structure', q: "How does the author mainly organize the passage?", choices: ["By comparing Jamestown with Spanish colonies.", "By explaining several causes of Jamestown's struggles.", "By describing a single day in the life of a colonist.", "By arguing that Jamestown should never have been built."], answer: 1, explain: "The author lists “the first problem,” “the second problem,” and another challenge from nature. Each one is a cause of the colony's hard years." },
      { type: 'mc', skill: 'inference', q: "Based on the second paragraph, what can you infer about why the colonists chose a poor location?", choices: ["They knew the water would turn salty but did not mind.", "The Powhatan people told them to build there.", "It was the only dry land along the river.", "They cared more about safety from enemies than about healthy land and water."], answer: 3, explain: "They picked the spot because it was easy to defend against Spanish ships, even though it was swampy and the water made them sick." },
      { type: 'mc', skill: 'vocabulary', q: "Read this sentence: “Crops withered, and food ran short.” What does “withered” mean?", choices: ["dried up and died", "grew very quickly", "were stolen by animals", "were sold in England"], answer: 0, explain: "The sentence comes right after the author describes a terrible drought. Without rain, plants dry up and die, which is what “withered” means." },
      { type: 'mc', skill: "author's purpose", q: "Why does the author mention tree rings from old cypress trees?", choices: ["To explain how the colonists built their fort.", "To show that trees were the colonists' main food.", "To show how scientists know a drought hurt the colony.", "To describe the beauty of the Virginia forest."], answer: 2, explain: "Tree rings are the evidence scientists used to learn that a bad drought hit the region while the colonists were there." },
      { type: 'evidence', skill: 'evidence', q: "Tap the sentence that best shows how deadly the first months at Jamestown were.", answer: ['4.1'], explain: "Only about 38 of the roughly 104 first colonists were still alive by January 1608, less than a year after they arrived." }
    ]
  },
  {
    id: 'r14',
    title: 'Strange Partners',
    genre: 'nonfiction',
    topic: 'symbiosis',
    paragraphs: [
      ["In nature, some living things form close partnerships with completely different species.", "Scientists call these long-term relationships symbiosis, which comes from Greek words meaning “living together.”", "Not every partnership is friendly, though."],
      ["In mutualism, both partners benefit.", "Consider the clownfish and the sea anemone.", "An anemone looks like a soft underwater flower, but its tentacles are covered in stinging cells that can stun small fish.", "A clownfish, however, has a special slimy coating that protects it, so it can live safely among the tentacles.", "The anemone shields the clownfish from predators that would get stung.", "In return, the clownfish cleans the anemone, chases away some fish that would nibble it, and leaves behind waste that gives the anemone nutrients."],
      ["In commensalism, one partner benefits while the other is barely affected.", "Remoras, for example, are fish that attach themselves to sharks with a suction disk on their heads.", "They get a free ride and eat scraps from the shark's meals, and the shark is mostly unbothered."],
      ["In parasitism, one partner benefits by harming the other.", "Ticks feed on the blood of animals such as deer and dogs, and they can spread diseases to them."],
      ["Some partnerships are harder to label.", "Oxpeckers are African birds that perch on zebras, giraffes, and buffalo, eating ticks off their skin.", "For years, this seemed like a perfect example of mutualism.", "Then scientists noticed that oxpeckers also peck at open wounds and drink the animals' blood, which can keep the wounds from healing.", "The bird is always helped, but the animal it rides on may be helped, harmed, or a little of both."]
    ],
    questions: [
      { type: 'mc', skill: 'central idea', q: "What is the central idea of the passage?", choices: ["Clownfish are the only fish that can live in sea anemones.", "All partnerships in nature help both partners.", "Different species form relationships that can help, harm, or barely affect each partner.", "Parasites are the most common animals on Earth."], answer: 2, explain: "The passage explains mutualism, commensalism, and parasitism, which are three ways a partnership can affect each species." },
      { type: 'mc', skill: 'vocabulary', q: "Read this sentence: “In commensalism, one partner benefits while the other is barely affected.” What does “barely affected” mean?", choices: ["hardly changed at all", "badly hurt", "greatly helped", "completely destroyed"], answer: 0, explain: "The remora example shows this: the shark is “mostly unbothered.” Barely affected means it hardly makes a difference to the shark." },
      { type: 'mc', skill: 'inference', q: "Why does the author say the oxpecker partnership is “harder to label”?", choices: ["Scientists have never studied oxpeckers closely.", "Oxpeckers live in Africa, so they are hard to watch.", "The large animals always chase the oxpeckers away.", "The birds help by eating ticks but can also harm the animals by keeping wounds open."], answer: 3, explain: "Oxpeckers eat ticks, which helps, but they also drink blood from wounds, which can hurt. So it does not fit neatly into one type." },
      { type: 'mc', skill: 'text structure', q: "How does the author organize most of the passage?", choices: ["By telling events in the order they happened.", "By naming a type of symbiosis and then giving an example of it.", "By describing a problem and offering solutions.", "By arguing that one type of relationship is the best."], answer: 1, explain: "Paragraphs begin with a type, like “In mutualism” or “In parasitism,” and then give an animal example." },
      { type: 'evidence', skill: 'evidence', q: "Tap the sentence that best shows how the anemone benefits from living with the clownfish.", answer: ['1.5'], explain: "This sentence lists what the anemone gets: cleaning, protection from fish that nibble it, and nutrients." }
    ]
  },
  {
    id: 'r15',
    title: 'Let Us Sleep: Why School Should Start Later',
    genre: 'nonfiction',
    topic: 'school start times',
    paragraphs: [
      ["Every weekday morning, millions of students drag themselves out of bed before the sun comes up.", "Many of them stumble into first period half awake.", "Middle and high schools should start later, because a later start would help students sleep more, learn better, and stay safer."],
      ["First, students are not simply staying up late on purpose.", "During the teenage years, the body's internal clock shifts, so many teens do not feel sleepy until around 11 p.m.", "Yet sleep experts say teens ages 13 to 18 need 8 to 10 hours of sleep each night, and younger kids need even more.", "If the bus comes at 6:45 a.m., that math simply does not work."],
      ["Second, doctors agree that this is a serious problem.", "The American Academy of Pediatrics, a major group of children's doctors, recommends that middle and high schools start no earlier than 8:30 a.m.", "Tired students have more trouble paying attention, remembering what they learned, and controlling their moods.", "Sleepy teens who drive are also more likely to get into car crashes."],
      ["Third, later start times have worked in real schools.", "When high schools in Seattle moved their start time later, researchers found that students slept about half an hour more each night.", "Their grades went up, and at one of the schools, more students showed up for first period."],
      ["Some people argue that a later start would make it harder to schedule buses, sports, and after-school jobs.", "These problems are real, but schools that have switched have solved them by changing bus routes and practice times.", "A schedule can be redrawn.", "A student's health is much harder to fix."],
      ["Schools exist to help students learn.", "It is time to let them show up awake enough to do it."]
    ],
    questions: [
      { type: 'mc', skill: 'point of view', q: "What is the author's main claim?", choices: ["Students should go to bed earlier on school nights.", "Schools should cancel after-school sports.", "Teenagers should be allowed to skip first period.", "Middle and high schools should start later in the morning."], answer: 3, explain: "The author states the claim at the end of the first paragraph: “Middle and high schools should start later.” Every other paragraph supports it." },
      { type: 'mc', skill: "author's purpose", q: "Why does the author include the paragraph about buses, sports, and after-school jobs?", choices: ["To respond to an argument from people who disagree.", "To show that later start times are a bad idea.", "To explain how buses choose their routes.", "To list the activities students enjoy most."], answer: 0, explain: "The paragraph begins “Some people argue,” then explains why those problems can be solved. That is a counterargument and a response." },
      { type: 'mc', skill: 'inference', q: "Which piece of evidence would best strengthen the author's argument?", choices: ["A chart of every bus route in the author's town.", "A list of the most popular after-school sports.", "A survey showing that students at a later-starting school felt less tired in class.", "A story about a student who loves waking up early."], answer: 2, explain: "The author argues that later starts help students feel rested and learn better. A survey showing less tired students would support that claim." },
      { type: 'mc', skill: 'vocabulary', q: "Read this sentence: “A schedule can be redrawn.” What does “redrawn” mean here?", choices: ["sketched with a pencil", "planned again in a new way", "thrown away completely", "made much shorter"], answer: 1, explain: "The author has just said schools changed bus routes and practice times. “Redrawn” means the schedule can be planned over again." },
      { type: 'evidence', skill: 'evidence', q: "Tap the sentence that gives real-world evidence that later start times work.", answer: ['3.1', '3.2'], explain: "The Seattle results are real-world evidence: students slept about half an hour more, and their grades went up." }
    ]
  },
  {
    id: 'r16',
    title: 'How Your Phone Knows Where You Are',
    genre: 'nonfiction',
    topic: 'GPS',
    paragraphs: [
      ["Open a map app, and a little blue dot shows exactly where you are standing.", "It feels like magic, but it is really a clever trick involving space, clocks, and the speed of light."],
      ["The Global Positioning System, or GPS, is a group of about 30 satellites run by the United States.", "They orbit roughly 12,500 miles above Earth, arranged so that several are always above any spot on the planet.", "Each satellite carries extremely accurate atomic clocks, and it constantly broadcasts a radio signal that says, in effect, “Here is where I am, and here is the exact time I sent this message.”"],
      ["Your phone has a GPS receiver that listens for these signals.", "It does not send anything back to the satellites; it only listens.", "When a signal arrives, the phone compares the time the signal was sent with the time it was received.", "Radio signals travel at the speed of light, so the phone multiplies that speed by the travel time to figure out how far away the satellite is."],
      ["Knowing your distance from one satellite is not enough, because you could be anywhere on a giant imaginary ball around it.", "Distances from several satellites, though, overlap at only one spot near Earth's surface.", "Your phone needs signals from at least four satellites to pin down its position, and the fourth helps correct small errors in the phone's own clock."],
      ["Timing has to be incredibly precise.", "A mistake of just one millionth of a second would put the blue dot about 1,000 feet off.", "Phones also use nearby cell towers and Wi-Fi signals to find their location faster, especially indoors, where satellite signals are weak."]
    ],
    questions: [
      { type: 'mc', skill: 'central idea', q: "What is the central idea of the passage?", choices: ["Phones send signals up to satellites, which report back where the phone is.", "GPS works by timing signals from several satellites to figure out a phone's location.", "Satellites take pictures of Earth to find where people are.", "Cell towers are the main way phones find their location outdoors."], answer: 1, explain: "Most of the passage explains how a phone times satellite signals to measure distances and find its spot. The phone only listens; it does not send signals up." },
      { type: 'mc', skill: 'inference', q: "Why do GPS satellites need extremely accurate clocks?", choices: ["Even a tiny timing error would make the location wrong.", "The clocks tell phones which time zone they are in.", "The clocks keep the satellites from falling out of orbit.", "The clocks help the satellites take clear photos."], answer: 0, explain: "The phone uses time to measure distance. The passage says a mistake of one millionth of a second would move the dot about 1,000 feet." },
      { type: 'mc', skill: 'vocabulary', q: "Read this sentence: “Your phone needs signals from at least four satellites to pin down its position, and the fourth helps correct small errors in the phone's own clock.” What does “pin down” mean?", choices: ["attach with a pin", "hide from others", "figure out exactly", "change quickly"], answer: 2, explain: "One satellite is not enough, but several together narrow it down to one spot. To “pin down” means to figure out exactly." },
      { type: 'mc', skill: 'text structure', q: "How does the author mainly organize the second, third, and fourth paragraphs?", choices: ["By comparing GPS with paper maps.", "By telling the history of GPS from beginning to end.", "By describing a problem and arguing about solutions.", "By explaining the steps of a process in order."], answer: 3, explain: "The author moves step by step: satellites send signals, the phone times them to find distances, then it combines several distances to find its location." },
      { type: 'evidence', skill: 'evidence', q: "Tap the sentence that best proves your phone does not send signals to the satellites.", answer: ['2.1'], explain: "The passage says the phone “does not send anything back to the satellites; it only listens.”" }
    ]
  }
];
