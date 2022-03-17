import './style.scss';
import classNames  from 'classnames';

type QuestionProps ={
    content: string;
    author: {
        name: string;
        avatar: string;
    };
    children?: React.ReactNode;
    isAnswered?: boolean;
    isHighLighted?: boolean;
}

export function Question({content, author, children, isAnswered = false, isHighLighted = false}: QuestionProps){
    return(
        <div 
        //className={`question ${isAnswered ? 'answered' : ''} ${isHighLighted ? 'highlighted' : ''} `}
        className={classNames(
            'question', 
            {answered: isAnswered},
            {highlighted: isHighLighted && !isAnswered},
            )}
        >
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt="User avatar" />
                    <span>{author.name}</span>
                </div>
                <div>{children}</div>
            </footer>
        </div>
    );
}