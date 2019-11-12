import java.io.*;

public class Agents implements Runnable{

	public void run(){
		try
        {  
        	//enviar la instrucción de ejecutar una llamada al sistema usando curl y listo
        	// curl -d "dir=0x9B5482c2281988aF7b928fCB034338C198AdCCAd" -X POST http://localhost:3000/exec/createContract

			//String instruction = "curl http://localhost:3000/";
			String instruction = "curl -d dir=0x9B5482c2281988aF7b928fCB034338C198AdCCAd -X POST http://localhost:3000/exec/createContract";
            Runtime rt = Runtime.getRuntime();
            Process proc = rt.exec(instruction);
            
            InputStream stdIn = proc.getInputStream();
			InputStreamReader isr = new InputStreamReader(stdIn);
			BufferedReader br = new BufferedReader(isr);

			String line = null;
			System.out.println("<OUTPUT>");
			Boolean intentar=true;
			while(intentar){
				if(br.ready()){
					while ((line = br.readLine()) != null){
					//while ((line = String.valueOf(br.read())) != "*"){
				    	System.out.println(line);
				    }
				    intentar = false;				
				}/*else{
					System.out.println("Nunca entré");	
				}*/
			}
			System.out.println("</OUTPUT>");
			int exitVal = proc.waitFor();
			System.out.println("Process exitValue: " + exitVal);
        } catch (Throwable t)
          {
            t.printStackTrace();
          }
	}
}
