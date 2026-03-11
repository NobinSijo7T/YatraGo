import mongoose from 'mongoose';

const DestinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for this destination.'],
        maxlength: [80, 'Name cannot be more than 80 characters'],
    },
    country: {
        type: String,
        default: '',
    },
    capital: {
        type: String,
        default: '',
    },
    currency: {
        type: String,
        default: '',
    },
    language: {
        type: String,
        default: '',
    },
    bestTimeToVisit: {
        type: String,
        default: '',
    },
    details: {
        type: String,
        required: [true, 'Please provide details for this destination.'],
    },
    // Tourist attractions / things to do
    whatToDo: {
        type: [String],
        default: [],
    },
    // How careful should the traveller be
    safetyLevel: {
        type: String,
        enum: ['Low', 'Moderate', 'High', 'Very High'],
        default: 'Moderate',
    },
    safetyTips: {
        type: [String],
        default: [],
    },
    packingList: {
        type: [String],
        default: [],
    },
    images: {
        type: [String],
        default: [],
    },
    continent: {
        type: String,
        enum: ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania', 'Antarctica'],
        required: true,
    },
    expense: {
        type: String,
        enum: ['Budget', 'Mid-range', 'Luxury'],
        default: 'Mid-range',
    },
    tags: {
        type: [String],
        default: [],
    }
}, {
    timestamps: true,
});

export default mongoose.models.Destination || mongoose.model('Destination', DestinationSchema);
