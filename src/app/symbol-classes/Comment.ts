export class Comment{
  
  static id: string = 's_comment';
  static s_name: string = 'Comment';

  commentText: string;

  constructor(){}

  setCommentText(comment_text: string){ this.commentText = comment_text; }
  getCommentText(){ this.commentText; }

}