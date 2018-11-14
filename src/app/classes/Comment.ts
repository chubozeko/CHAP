export class Comment{
  
  static id: string = 's_comment';
  static s_name: string = 'Comment';

  commentText: string = '';

  commentSymbol: any;

  constructor(){}

  setCommentSymbol( symbol: any ){ this.commentSymbol = symbol; }
  getCommentSymbol(){ return this.commentSymbol; }

  setCommentText(comment_text: string){ this.commentText = comment_text; }
  getCommentText(){ return this.commentText; }

  getCommentExpression(){
    return '// ' + this.commentText;
  }

  toString(){ return '\t' + this.getCommentExpression() + '\n'; }

}