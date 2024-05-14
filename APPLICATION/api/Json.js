import axios from 'axios';

export default axios.create({
    baseUrl: 'https://api.thingspeak.com/channels/1639155/feeds',
});