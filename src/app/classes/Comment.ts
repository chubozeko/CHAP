export class Comment {

  static s_name: string = 'Comment';
  id: string = 's_comment';

  commentText: string = '';

  commentSymbol: any;

  constructor() { }

  createCommentSymbol(commentSym: any) { }

  setCommentSymbol(symbol: any) { this.commentSymbol = symbol; }
  getCommentSymbol() { return this.commentSymbol; }

  setCommentText(comment_text: string) { this.commentText = comment_text; }
  getCommentText() { return this.commentText; }

  getCommentExpression() { return '// ' + this.commentText; }

  pseudoCode() { return '\t' + this.getCommentExpression() + '\n'; }

  cplusplusCode() { return '\t/*' + this.commentText + '*/\n'; }

  getJavaCode() { return '\t\t/*' + this.commentText + '*/\n'; }

}