/*
  TODO: solutionFlowchart should be loaded from external exercise CHAP files (.chap)
*/

export let ExerciseData = [
  {
    exer_id: 1,
    level: `Easy`,
    description: `Display "Hello World" with using OUTPUT SYMBOL on CHAP. Sample Run:Hello World`,
    filename: `exercise_1`,
    solutionFlowchart: [{"s_id":"s_output","id":"fc_lvl_0_out_0","symbolIndex":0,"parentIndex":-1,"isInTrueLoopBlock":true,"outputExp":"`Hello World`","outputS":"","outputSymbol":{"__zone_symbol__contextmenufalse":[{"type":"eventTask","state":"scheduled","source":"HTMLDivElement.addEventListener:contextmenu","zone":"angular","runCount":0}]}}],
    xp: 100
  },
  {
    exer_id: 2,
    level: `Easy`,
    description: `Get two integers from user and display summation on console with using CHAP. Sample Run: USER INPUT 2,2,OUTPUT 4`,
    filename: `exercise_2`,
    solutionFlowchart: [{"s_id":"s_declare","id":"fc_lvl_0_dec_0","symbolIndex":0,"parentIndex":-1,"isInTrueLoopBlock":true,"text":"","variableName":"num1, num2, sum","data_type":"Integer","isArray":false,"arraySize":0,"declareExpression":"Integer num1, num2, sum","declareSymbol":{"__zone_symbol__contextmenufalse":[{"type":"eventTask","state":"scheduled","source":"HTMLDivElement.addEventListener:contextmenu","zone":"angular","runCount":0}]}},{"s_id":"s_input","id":"fc_lvl_0_inp_1","symbolIndex":1,"parentIndex":-1,"isInTrueLoopBlock":true,"variableName":"num1","inputExpression":"num1","inputPrompt":"","isInputEntered":false,"inputPromptProps":{},"alertC":{"ctrl":"ion-alert-controller"},"inputSymbol":{"__zone_symbol__contextmenufalse":[{"type":"eventTask","state":"scheduled","source":"HTMLDivElement.addEventListener:contextmenu","zone":"angular","runCount":0}]}},{"s_id":"s_input","id":"fc_lvl_0_inp_2","symbolIndex":2,"parentIndex":-1,"isInTrueLoopBlock":true,"variableName":"num2","inputExpression":"num2","inputPrompt":"","isInputEntered":false,"inputPromptProps":{},"alertC":{"ctrl":"ion-alert-controller"},"inputSymbol":{"__zone_symbol__contextmenufalse":[{"type":"eventTask","state":"scheduled","source":"HTMLDivElement.addEventListener:contextmenu","zone":"angular","runCount":0}]}},{"s_id":"s_process","id":"fc_lvl_0_proc_3","symbolIndex":3,"parentIndex":-1,"isInTrueLoopBlock":true,"variableName":"sum","expression":"num1 + num2","processExpression":"sum = num1 + num2","processValue":[],"processSymbol":{"__zone_symbol__contextmenufalse":[{"type":"eventTask","state":"scheduled","source":"HTMLDivElement.addEventListener:contextmenu","zone":"angular","runCount":0}]}},{"s_id":"s_output","id":"fc_lvl_0_out_4","symbolIndex":4,"parentIndex":-1,"isInTrueLoopBlock":true,"outputExp":"sum","outputS":"","outputSymbol":{"__zone_symbol__contextmenufalse":[{"type":"eventTask","state":"scheduled","source":"HTMLDivElement.addEventListener:contextmenu","zone":"angular","runCount":0}]}}],
    xp: 100
  },
  {
    exer_id: 3,
    level: `Moderate`,
    description: `Get one integer number from user and check if entered number is odd or even as an output on console using CHAP.Sample Run:User INPUT=2,OUTPUT= Number is Even`,
    filename: `exercise_3`,
    solutionFlowchart: [{"s_id":"s_declare","id":"fc_lvl_0_dec_0","symbolIndex":0,"parentIndex":-1,"isInTrueLoopBlock":true,"text":"","variableName":"x","data_type":"Integer","isArray":false,"arraySize":0,"declareExpression":"Integer x","declareSymbol":{"__zone_symbol__contextmenufalse":[{"type":"eventTask","state":"scheduled","source":"HTMLDivElement.addEventListener:contextmenu","zone":"angular","runCount":0}]}},{"s_id":"s_input","id":"fc_lvl_0_inp_1","symbolIndex":1,"parentIndex":-1,"isInTrueLoopBlock":true,"variableName":"x","inputExpression":"x","inputPrompt":"Enter a value of type Integer for variable x","isInputEntered":false,"inputPromptProps":["Enter a value of type Integer for variable x",0,1,[{"isArray":false,"name":"x","dataType":"Integer","value":2}],null],"alertC":{"ctrl":"ion-alert-controller"},"inputSymbol":{"__zone_symbol__contextmenufalse":[{"type":"eventTask","state":"scheduled","source":"HTMLDivElement.addEventListener:contextmenu","zone":"angular","runCount":0}]},"inputData":"2"},{"s_id":"s_if_case","id":"fc_lvl_0_if_2","symbolIndex":2,"parentIndex":-1,"isInTrueLoopBlock":true,"ifStatement":"x % 2 == 0","trueBlockId":"lvl_0_if_true_2","falseBlockId":"lvl_0_if_false_2","trueBlockSymbols":[{"s_id":"s_output","id":"ift_2_lvl_1_out_0","symbolIndex":0,"parentIndex":2,"isInTrueLoopBlock":true,"outputExp":"`Number is EVEN`","outputS":"Number is EVEN","outputSymbol":{},"chapConsole":{}}],"falseBlockSymbols":[{"s_id":"s_output","id":"iff_2_lvl_1_out_0","symbolIndex":0,"parentIndex":2,"isInTrueLoopBlock":false,"outputExp":"`Number is ODD`","outputS":"Number is ODD","outputSymbol":{},"chapConsole":{}}],"ifcaseSymbol":{"__zone_symbol__contextmenufalse":[{"type":"eventTask","state":"scheduled","source":"HTMLDivElement.addEventListener:contextmenu","zone":"angular","runCount":0}]}}],
    xp: 200
  },
  {
    exer_id: 4,
    level: `Moderate`,
    description: `Display "HELLO CHAP" as an output 4 times using a For Loop. Sample Run:HELLO CHAP,HELLO CHAP,HELLO CHAP,HELLO CHAP`,
    filename: `exercise_4`,
    solutionFlowchart: [{"s_id":"s_declare","id":"fc_lvl_0_dec_0","symbolIndex":0,"parentIndex":-1,"isInTrueLoopBlock":true,"text":"","variableName":"i","data_type":"Integer","isArray":false,"arraySize":0,"declareExpression":"Integer i","declareSymbol":{"__zone_symbol__contextmenufalse":[{"type":"eventTask","state":"scheduled","source":"HTMLDivElement.addEventListener:contextmenu","zone":"angular","runCount":0}]}},{"s_id":"s_for_loop","id":"fc_lvl_0_for_1","symbolIndex":1,"parentIndex":-1,"isInTrueLoopBlock":true,"forLoopExpression":"i = 1 to 4 increment 1","forVariableName":"i","stepDirection":"Increasing","stepValue":1,"trueBlockId":"lvl_0_for_true_1","falseBlockId":"","startValue":1,"endValue":4,"trueLoopBlock":[{"s_id":"s_output","id":"fort_1_lvl_1_out_0","symbolIndex":0,"parentIndex":1,"isInTrueLoopBlock":true,"outputExp":"`HELLO CHAP`","outputS":"HELLO CHAP","outputSymbol":{},"chapConsole":{}}],"falseLoopBlock":[],"forLoopVariable":{"name":"i","isArray":false,"dataType":"Integer","value":4},"forLoopSymbol":{"__zone_symbol__contextmenufalse":[{"type":"eventTask","state":"scheduled","source":"HTMLDivElement.addEventListener:contextmenu","zone":"angular","runCount":0}]},"currentValue":5}],
    xp: 200
  },
  {
    exer_id: 5,
    level: `Advanced`,
    description: `Display EVEN Numbers from 0 to 10 with both include with using WHILE LOOP Sample Run:0,2,4,6,8,10.`,
    filename: `exercise_5`,
    solutionFlowchart: [{"s_id":"s_declare","id":"fc_lvl_0_dec_0","symbolIndex":0,"parentIndex":-1,"isInTrueLoopBlock":true,"text":"","variableName":"x","data_type":"Integer","isArray":false,"arraySize":0,"declareExpression":"Integer x","declareSymbol":{"__zone_symbol__contextmenufalse":[{"type":"eventTask","state":"scheduled","source":"HTMLDivElement.addEventListener:contextmenu","zone":"angular","runCount":0}]}},{"s_id":"s_process","id":"fc_lvl_0_proc_1","symbolIndex":1,"parentIndex":-1,"isInTrueLoopBlock":true,"variableName":"x","expression":"1","processExpression":"x = 1","processValue":[],"processSymbol":{"__zone_symbol__contextmenufalse":[{"type":"eventTask","state":"scheduled","source":"HTMLDivElement.addEventListener:contextmenu","zone":"angular","runCount":0}]},"consoleLog":{},"processDataType":"Integer"},{"s_id":"s_while_loop","id":"fc_lvl_0_whi_2","symbolIndex":2,"parentIndex":-1,"isInTrueLoopBlock":true,"whileExpression":"x <= 10","trueBlockId":"lvl_0_whi_true_2","falseBlockId":"","trueLoopBlock":[{"s_id":"s_output","id":"whit_2_lvl_1_out_0","symbolIndex":0,"parentIndex":2,"isInTrueLoopBlock":true,"outputExp":"x","outputS":"10","outputSymbol":{},"chapConsole":{}},{"s_id":"s_process","id":"whit_2_lvl_1_proc_1","symbolIndex":1,"parentIndex":2,"isInTrueLoopBlock":true,"variableName":"x","expression":"x + 1","processExpression":"x = x + 1","processValue":[],"processSymbol":{},"consoleLog":{},"processDataType":"Integer"}],"falseLoopBlock":[],"whileSymbol":{"__zone_symbol__contextmenufalse":[{"type":"eventTask","state":"scheduled","source":"HTMLDivElement.addEventListener:contextmenu","zone":"angular","runCount":0}]}}],
    xp: 300
  },
]