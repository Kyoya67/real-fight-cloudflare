'use client';

import { useState, useEffect } from 'react';
import { getComments, postComment, type Comment } from '../../lib/commentApi';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface CommentSectionProps {
    comicId: string;
}

export default function CommentSection({ comicId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [comicId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const data = await getComments(comicId);
            setComments(data);
        } catch (error) {
            console.error('コメント取得エラー:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCommentSubmit = async (content: string) => {
        try {
            setPosting(true);
            await postComment(comicId, content);
            await fetchComments();
        } catch (error) {
            console.error('コメント投稿エラー:', error);
            alert('コメント投稿中にエラーが発生しました');
        } finally {
            setPosting(false);
        }
    };

    return (
        <div className="bg-white">
            <div className="p-4">
                <CommentForm onSubmit={handleCommentSubmit} isPosting={posting} />
                <CommentList comments={comments} loading={loading} />
            </div>
        </div>
    );
} 