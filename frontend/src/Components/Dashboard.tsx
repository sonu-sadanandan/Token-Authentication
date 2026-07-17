import React, { useState } from 'react';
import { useAuth } from '../auth/authContext';

interface ProtectedResponsse {
    message: string;
}

interface ErrorResponse {
    detail: string;
}
