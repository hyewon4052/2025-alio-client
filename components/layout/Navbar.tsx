'use client';

import styled from "styled-components";
import Flex from "@/components/common/Flex";
import Text from "@/components/common/Text";
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isHomeActive = !isAuthPage && (pathname === '/' || pathname === '/home');
    const isNewsActive = !isAuthPage && pathname === '/news';
    const isCommunityActive = !isAuthPage && pathname === '/community';

    return (
        <NavbarContainer>
            <NavbarWrapper>
                <LogoLink href="/home">
                    <Text color="#6F00FF" fontSize={24} fontWeight={600}>
                        ailo
                    </Text>
                </LogoLink>

                <NavMenu>
                    <NavItem $active={isHomeActive} onClick={() => router.push("/home")}>
                        <Text color={isHomeActive ? "#000000" : "#FFFFFF"} fontSize={15} fontWeight={700}>
                            Home
                        </Text>
                    </NavItem>
                    <NavItem $active={isCommunityActive} onClick={() => router.push("/community")}>
                        <Text color={isCommunityActive ? "#000000" : "#FFFFFF"} fontSize={15} fontWeight={700}>
                            Community
                        </Text>
                    </NavItem>
                    <NavItem $active={isNewsActive} onClick={() => router.push("/news")}>
                        <Text color={isNewsActive ? "#000000" : "#FFFFFF"} fontSize={15} fontWeight={700}>
                            News
                        </Text>
                    </NavItem>
                </NavMenu>

                <ProfileIcon>
                    <img src="/images/profile.svg" alt="Profile" width={40} height={40}/>
                </ProfileIcon>
            </NavbarWrapper>
        </NavbarContainer>
    );
}

const NavbarContainer = styled.div`
    width: 100%;
    background-color: #1D1C25;
    padding: 10px 0;
    position: fixed;
    z-index: 10;
`;

const NavbarWrapper = styled(Flex)`
    align-items: center;
    flex-direction: row;
    max-width: 1331px;
    margin: 0 auto;
    padding: 0 23px;
    justify-content: space-between;
`;

const LogoLink = styled(Link)`
    text-decoration: none;
    cursor: pointer;
`;

const NavMenu = styled(Flex)`
    flex-direction: row;
    height: 54px;
    align-items: center;
    padding: 9px 5px;
    margin: 0 5px;
    gap: 28px;
    border-radius: 40px;
    border: 0.2px solid var(linear-gradient(92deg, #797979 -3.24%, rgba(121, 121, 121, 0.00) 109.72%), #797979);
    background: #22212D;
    backdrop-filter: blur(2px);
`;

const NavItem = styled.div<{ $active: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border-radius: 500px;
    width: ${({$active}) => ($active ? '110px' : 'auto')};
    height: 40px;
    padding: ${({$active}) => ($active ? '0 35px' : '8px 20px')};
    background-color: ${({$active}) => ($active ? '#FFFFFF' : 'transparent')};
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
        background-color: ${({$active}) => ($active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.1)')};
    }
`;


const NavLink = styled(Link)`
    text-decoration: none;
    display: block;
`;

const ProfileIcon = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
`;
