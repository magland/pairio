import { FunctionComponent, useCallback, useState } from "react"
import LoginButton from "../../LoginButton"
import { useLogin } from "../../LoginContext/LoginContext"
import { apiPostRequest } from "../../hooks"
import { CreateComputeClientRequest, isCreateComputeClientResponse } from "../../types"
import useRoute from "../../useRoute"

type RegisterComputeClientPageProps = {
    // none
}

const RegisterComputeClientPage: FunctionComponent<RegisterComputeClientPageProps> = () => {
    const { route } = useRoute()
    const [code, setCode] = useState<string>('')
    const { userId, githubAccessToken } = useLogin()
    const onRegister = useCallback(async () => {
        console.info('Registering compute client...')
        if (!userId) return
        console.info('userId: ', userId)
        if (!githubAccessToken) return
        console.info('githubAccessToken: ', githubAccessToken)
        const req: CreateComputeClientRequest = {
            type: 'createComputeClientRequest',
            serviceName,
            computeClientName,
            userId
        }
        const resp = await apiPostRequest('createComputeClient', req, githubAccessToken)
        if (!isCreateComputeClientResponse(resp)) {
            console.error('Unexpected response: ', resp)
            return
        }
        const { computeClientId, computeClientPrivateKey } = resp
        const codeJson = {
            serviceName,
            computeClientName,
            computeClientId,
            computeClientPrivateKey
        }
        const codeBase64 = btoa(JSON.stringify(codeJson))
        setCode(codeBase64)
    }, [])
    if (route.page !== 'register_compute_client') {
        throw new Error('Invalid route')
    }
    const serviceName = route.serviceName
    const computeClientName = route.computeClientName
    return (
        <div style={{padding: 20, maxWidth: 500}}>
            <h3>Register compute client</h3>
            <div>
                <p>Service: {serviceName}</p>
                <p>Compute client name: {computeClientName}</p>
            </div>
            <hr />
            {
                !userId && (
                    <div>
                        <p>You must be logged in to register a compute client.</p>
                        <LoginButton />
                    </div>
                )
            }
            {userId && githubAccessToken && (
                code ? (
                    <div>
                        <h3>Use the following code to register the compute client:</h3>
                        <div>
                            <pre>{code}</pre>
                        </div>
                    </div>
                ) : <div>
                    <button onClick={onRegister}>Register compute client</button>
                </div>
            )}
        </div>
    )
}

export default RegisterComputeClientPage