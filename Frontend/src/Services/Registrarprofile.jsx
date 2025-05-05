import styled from 'styled-components';

// Profile Card Components
export const ProfileCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

export const ProfileAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #3f51b5;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  margin-right: 20px;
`;

export const ProfileTitle = styled.div`
  h3 {
    margin: 0 0 8px 0;
    font-size: 24px;
    color: #333;
  }
`;

export const RoleBadge = styled.span`
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
`;

export const ProfileDetails = styled.div`
  margin-bottom: 24px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 20px 0;
`;

export const DetailItem = styled.div`
  display: flex;
  margin-bottom: 12px;
  align-items: center;
`;

export const DetailLabel = styled.span`
  font-weight: 600;
  width: 120px;
  color: #666;
`;

export const DetailValue = styled.span`
  color: #333;
  flex: 1;
`;

export const StatusActive = styled.span`
  color: #4caf50;
  background-color: rgba(76, 175, 80, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
`;

export const ProfileSummary = styled.div`
  h4 {
    margin-top: 0;
    margin-bottom: 16px;
    color: #333;
  }
`;

export const SummaryStats = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export const SummaryStat = styled.div`
  text-align: center;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  min-width: 100px;
  flex: 1;
  margin: 0 8px;
  
  &:first-child {
    margin-left: 0;
  }
  
  &:last-child {
    margin-right: 0;
  }
`;

export const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #3f51b5;
  margin-bottom: 4px;
`;

export const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
`;
