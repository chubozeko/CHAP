import { Comment } from "./Comment";
import { Declare } from "./Declare";
import { DoWhileLoop } from "./DoWhileLoop";
import { ForLoop } from "./ForLoop";
import { IfCase } from "./IfCase";
import { Input } from "./Input";
import { Output } from "./Output";
import { Process } from "./Process";
import { WhileLoop } from "./WhileLoop";

export type Symbols = Declare | Input | Output | Process | IfCase | ForLoop | WhileLoop | DoWhileLoop | Comment;