import showService from '@/services/showService';
import { Request, Response } from 'express';

// Show 생성 라우트 핸들러
export const createShow = async (req: Request, res: Response) => {
    try {
        const showData = req.body;
        // 파일 관련 로직 없이 Show 데이터만 서비스 함수로 전달
        const newShow = await showService.createShow(showData);
        res.status(201).json(newShow);
    } catch (error: any) {
        console.error('Error creating show:', error);
        res.status(500).json({ message: error.message });
    }
};

// 특정 Show의 배경 이미지 삭제 핸들러
export const deleteShowBackgroundImage = async (req: Request, res: Response) => {
    try {
        const showId = req.params.showId;

        // showService의 배경 이미지 삭제 함수 호출
        // 이 함수는 해당 showId를 가진 쇼의 배경 이미지 URL을 찾고 파일 삭제 후 URL을 null로 업데이트합니다.
        const success = await showService.deleteShowBackgroundImage(showId);

        if (success) {
            res.json({ message: 'Background image deleted successfully' });
        } else {
            res.status(404).json({ message: 'Show not found or background image not found/failed to delete' });
        }
    } catch (error: any) {
        console.error(`Error deleting background image for show ${req.params.showId}:`, error);
        res.status(500).json({ message: error.message });
    }
};

// 모든 Show 조회 라우트 핸들러
export const getAllShows = async (req: Request, res: Response) => {
    try {
        const shows = await showService.getAllShows();
        res.json(shows);
    } catch (error: any) {
        console.error('Error fetching all shows:', error);
        res.status(500).json({ message: error.message });
    }
};

// 특정 Show 조회 라우트 핸들러
export const getShow = async (req: Request, res: Response) => {
    try {
        const showId = req.params.id;
        const show = await showService.getShowById(showId);
        if (show) {
            res.json(show);
        } else {
            res.status(404).json({ message: 'Show not found' });
        }
    } catch (error: any) {
        console.error(`Error fetching show ${req.params.id}:`, error);
        res.status(500).json({ message: error.message });
    }
};


// Show 업데이트 라우트 핸들러 (배경 이미지 파일 처리 로직 제외)
export const updateShow = async (req: Request, res: Response) => {
    try {
        const showId = req.params.id;
        const updateData = req.body; // 배경 이미지 파일 관련 정보는 여기에 포함되지 않음

        // 파일 관련 로직 없이 Show 데이터만 서비스 함수로 전달
        const updatedShow = await showService.updateShow(showId, updateData); // 파일 인자 제거
        if (updatedShow) {
            res.json(updatedShow);
        } else {
            res.status(404).json({ message: 'Show not found or update failed' });
        }
    } catch (error: any) {
        console.error(`Error updating show ${req.params.id}:`, error);
        res.status(500).json({ message: error.message });
    }
};

// Show 삭제 라우트 핸들러
export const deleteShow = async (req: Request, res: Response) => {
    try {
        const showId = req.params.id;
        const success = await showService.deleteShow(showId); // Change to showService.deleteShow

        if (success) {
            res.json({ message: 'Show deleted successfully' });
        } else {
            res.status(404).json({ message: 'Show not found' });
        }
    } catch (error: any) {
        console.error(`Error deleting show ${req.params.id}:`, error);
        res.status(500).json({ message: error.message });
    }
};
// 특정 Show의 배경 이미지 업로드 및 URL 업데이트 핸들러
export const uploadShowBackgroundImage = async (req: Request, res: Response) => {
    try {
        const showId = req.params.showId;
        const file = req.file; // 업로드된 이미지 파일 (upload.single('backgroundImage') 미들웨어 사용 시)

        if (!file) {
            return res.status(400).json({ message: 'No background image file uploaded.' });
        }

        // 수정된 updateShowBackgroundImageUrl 서비스 함수 호출
        // 이 서비스 함수는 이미지 업로드, 기존 이미지 삭제, URL 업데이트 모두 처리
        const updatedShow = await showService.updateShowBackgroundImageUrl(showId, file); // showId와 파일 객체 전달


        if (updatedShow) {
            // 업데이트된 Show 정보를 포함하여 응답
            res.json({ message: 'Background image uploaded and show updated successfully', show: updatedShow });
        } else {
            // Show가 없거나 업데이트 실패 시 404 응답
            res.status(404).json({ message: 'Show not found or background image upload failed' });
        }

    } catch (error: any) {
        console.error(`Error uploading background image for show ${req.params.showId}:`, error);
        res.status(500).json({ message: error.message });
    }
};