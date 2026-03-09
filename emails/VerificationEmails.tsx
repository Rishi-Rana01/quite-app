import { Html, Head, Font, Preview, Heading, Row, Section, Text, Button } from "@react-email/components";

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
        <Html lang="en" dir='ltr'>
            <Head>
                <title>Verification Code</title>
                <Font
                    fontFamily="Arial"
                    fallbackFontFamily="Verdana"
                    fontWeight="normal"
                    fontStyle="normal"
                />
            </Head>
            <Preview>Here&apos;s your verification code: {otp}</Preview>
            <Section>
                <Row>
                    <Heading >Hello {username}!</Heading>
                </Row>
                <Row>
                    <Text>Thank you for signing up. Please use the following verification code to complete your registration:</Text>
                </Row>
                <Row>
                    <Text>{otp}</Text>
                </Row>
                <Row>
                    <Button href="" style={{ backgroundColor: '#0070f3', color: '#ffffff', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none' }}>
                        Verify here !
                    </Button>
                </Row>
            </Section>
        </Html>
    );
}


