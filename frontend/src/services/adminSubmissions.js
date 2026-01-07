import config from '../config/config';

export async function markSubmissionRead(id, isRead) {
    const response = await fetch(
        `${config.api.baseURL}/admin/submissions/${id}/read`,
        {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(isRead)
        }
    );

    if (!response.ok) throw new Error('Failed to update status');
    return response;
}

export async function deleteSubmission(id) {
    const response = await fetch(
        `${config.api.baseURL}/admin/submissions/${id}`,
        { method: 'DELETE' }
    );

    if (!response.ok) throw new Error('Failed to delete');
    return response;
}
